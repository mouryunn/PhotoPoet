"use client";

import { useRef, useCallback, useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Copy, Share2, RefreshCw, Download } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toPng } from 'html-to-image';

interface PoemDisplayProps {
  photoDataUri: string;
  poem: string;
  onReset: () => void;
}

export function PoemDisplay({ photoDataUri, poem, onReset }: PoemDisplayProps) {
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  const [showShareButton, setShowShareButton] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setShowShareButton(true);
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(poem)
      .then(() => {
        toast({
          title: "Poem Copied!",
          description: "The poem has been copied to your clipboard.",
        });
      })
      .catch(err => {
        toast({
          variant: "destructive",
          title: "Copy Failed",
          description: "Could not copy the poem to your clipboard.",
        });
      });
  };

  const handleShare = async () => {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: 'Poem from PhotoPoet',
          text: poem,
        });
      } catch (error) {
        // User cancellation (AbortError) or permission denial (NotAllowedError) are expected behaviors,
        // not application errors. We'll avoid logging them to the console and showing a failure toast.
        if (error instanceof DOMException && (error.name === 'AbortError' || error.name === 'NotAllowedError')) {
          // Silently ignore. The user or browser has already handled this.
          console.log("Sharing was cancelled or not permitted.");
        } else {
          console.error('Error sharing:', error);
          toast({
            variant: "destructive",
            title: "Share Failed",
            description: "There was an unexpected error trying to share the poem.",
          });
        }
      }
    } else {
      toast({
        title: "Share not supported",
        description: "Your browser does not support the Web Share API. You can copy the poem instead.",
      });
    }
  };

  const handleDownload = useCallback(() => {
    if (cardRef.current === null) {
      return;
    }

    toPng(cardRef.current, { cacheBust: true, backgroundColor: 'white' })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'photopoet-poem.png';
        link.href = dataUrl;
        link.click();
        toast({
          title: "Image Downloaded",
          description: "Your poem tile has been successfully downloaded.",
        });
      })
      .catch((err) => {
        console.error('Download error:', err);
        toast({
          variant: "destructive",
          title: "Download Failed",
          description: "Could not download the poem tile as an image.",
        });
      });
  }, [cardRef, toast]);

  return (
    <Card ref={cardRef} className="w-full max-w-4xl animate-in fade-in duration-700 shadow-lg">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="relative aspect-square md:aspect-auto">
          <Image
            src={photoDataUri}
            alt="Uploaded inspiration"
            width={600}
            height={600}
            className="object-cover w-full h-full md:rounded-l-lg rounded-t-lg md:rounded-tr-none"
            data-ai-hint="artistic photo"
          />
        </div>
        <div className="flex flex-col bg-card">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Your Poem</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <Separator className="mb-6" />
            <p className="whitespace-pre-wrap text-left text-lg leading-relaxed font-body">
              {poem}
            </p>
          </CardContent>
          <CardFooter className="flex-col sm:flex-row gap-2 justify-end bg-muted/50 p-4 rounded-b-lg md:rounded-bl-none">
            <Button variant="ghost" onClick={handleCopy}><Copy /> Copy</Button>
            {showShareButton && <Button variant="ghost" onClick={handleShare}><Share2 /> Share</Button>}
            <Button variant="ghost" onClick={handleDownload}><Download /> Download</Button>
            <Button onClick={onReset}><RefreshCw /> New Poem</Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
