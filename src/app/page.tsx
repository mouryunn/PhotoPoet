"use client";

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { PhotoUploader } from '@/components/photo-uploader';
import { PoemDisplay } from '@/components/poem-display';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { generatePoem } from '@/ai/flows/generate-poem';
import { LoaderCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [poem, setPoem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>('English');
  const [mood, setMood] = useState<string>('Evocative');
  const { toast } = useToast();

  const handlePhotoUpload = async (file: File) => {
    setError(null);
    setPoem(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUri = e.target?.result as string;
      setPhotoDataUri(dataUri);
      setIsLoading(true);
      try {
        const result = await generatePoem({ photoDataUri: dataUri, language, mood });
        setPoem(result.poem);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Error generating poem",
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setPhotoDataUri(null);
    setPoem(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8 text-center">
        {!photoDataUri && !isLoading && (
          <div className="w-full max-w-lg animate-in fade-in duration-500">
            <h2 className="font-headline text-3xl md:text-4xl text-foreground mb-4">Upload a Photo to Inspire a Poem</h2>
            <p className="text-muted-foreground mb-8">Let our AI poet create a unique verse from your image.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-left">
              <div>
                <Label htmlFor="language" className="mb-2 block">Poem Language</Label>
                <Select value={language} onValueChange={setLanguage} disabled={isLoading}>
                    <SelectTrigger id="language" className="w-full">
                        <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Common Languages</SelectLabel>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                        <SelectItem value="Italian">Italian</SelectItem>
                        <SelectItem value="Japanese">Japanese</SelectItem>
                        <SelectItem value="Russian">Russian</SelectItem>
                        <SelectItem value="Chinese">Chinese</SelectItem>
                      </SelectGroup>
                      <SelectSeparator />
                      <SelectGroup>
                        <SelectLabel>Indian Languages</SelectLabel>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                        <SelectItem value="Bengali">Bengali</SelectItem>
                        <SelectItem value="Marathi">Marathi</SelectItem>
                        <SelectItem value="Telugu">Telugu</SelectItem>
                        <SelectItem value="Tamil">Tamil</SelectItem>
                        <SelectItem value="Gujarati">Gujarati</SelectItem>
                        <SelectItem value="Urdu">Urdu</SelectItem>
                        <SelectItem value="Kannada">Kannada</SelectItem>
                        <SelectItem value="Odia">Odia</SelectItem>
                        <SelectItem value="Malayalam">Malayalam</SelectItem>
                        <SelectItem value="Punjabi">Punjabi</SelectItem>
                        <SelectItem value="Assamese">Assamese</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="mood" className="mb-2 block">Poem Mood</Label>
                <Select value={mood} onValueChange={setMood} disabled={isLoading}>
                    <SelectTrigger id="mood" className="w-full">
                        <SelectValue placeholder="Select a mood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Moods</SelectLabel>
                        <SelectItem value="Evocative">Evocative</SelectItem>
                        <SelectItem value="Romantic">Romantic</SelectItem>
                        <SelectItem value="Humorous">Humorous</SelectItem>
                        <SelectItem value="Melancholic">Melancholic</SelectItem>
                        <SelectItem value="Inspirational">Inspirational</SelectItem>
                        <SelectItem value="Mysterious">Mysterious</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                </Select>
              </div>
            </div>

            <PhotoUploader onPhotoUpload={handlePhotoUpload} disabled={isLoading} />
          </div>
        )}
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
            <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
            <p className="font-headline text-2xl text-foreground">Generating your poem...</p>
            <p className="text-muted-foreground">This may take a moment.</p>
          </div>
        )}

        {photoDataUri && !isLoading && poem && (
          <PoemDisplay photoDataUri={photoDataUri} poem={poem} onReset={handleReset} />
        )}
        
        {error && !isLoading && (
           <div className="text-destructive space-y-4 animate-in fade-in duration-500 max-w-xl text-left bg-destructive/10 p-4 rounded-md">
              <p className="font-bold">Failed to generate poem. Please try another image or check the error below.</p>
              <pre className="text-xs whitespace-pre-wrap font-mono bg-background/50 p-2 rounded-sm">{error}</pre>
              <Button onClick={handleReset} variant="outline">Try Again</Button>
           </div>
        )}
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>Created with PhotoPoet</p>
      </footer>
    </div>
  );
}
