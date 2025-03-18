/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { Check, ChevronDown, Globe } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Extend the Window interface to include the Google Translate properties
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: {
      translate: {
        TranslateElement: {
          InlineLayout: {
            SIMPLE: number;
            HORIZONTAL: number;
            VERTICAL: number;
          };
          new (options: {
            pageLanguage: string;
            includedLanguages?: string;
            layout?: number;
            autoDisplay?: boolean;
          }, elementId: string): any;
        };
      };
    };
  }
}

type Language = 'en' | 'hi';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

const LanguageSwitcher: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isTranslateLoaded, setIsTranslateLoaded] = useState(false);

  const languages: LanguageOption[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
  ];

  useEffect(() => {
    // Initialize Google Translate with a hidden element
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi',
          autoDisplay: false,
        },
        'google_translate_element'
      );
      setIsTranslateLoaded(true);
    };
  }, []);
  useEffect(() => {
    // Function to remove Google Translate toolbar
    const removeGoogleTranslateToolbar = () => {
      // Check if the iframe exists
      const iframe = document.querySelector('.goog-te-banner-frame') as HTMLIFrameElement;
      if (iframe) {
        // Remove the iframe
        iframe.remove();
      }
  
      // Remove the added top margin to body
      document.body.style.top = '0px';
      
      // Also look for and remove the .skiptranslate class elements
      const skiptranslate = document.querySelector('.skiptranslate') as HTMLElement;
      if (skiptranslate) {
        skiptranslate.classList.remove('skiptranslate');
      }
    };
  
    // Call the function when the language is switched and periodically to ensure it's gone
    if (isTranslateLoaded) {
      // Initial removal
      removeGoogleTranslateToolbar();
      
      // Keep checking every second for a brief period to ensure it stays gone
      // This is needed because Google Translate might re-add the toolbar
      const intervalId = setInterval(removeGoogleTranslateToolbar, 1000);
      
      // Clear interval after 5 seconds
      setTimeout(() => clearInterval(intervalId), 5000);
    }
  }, [isTranslateLoaded, currentLanguage]);

  // Switch language function
  const switchLanguage = (langCode: Language) => {
    if (!isTranslateLoaded) return;
    
    // Update state for UI
    setCurrentLanguage(langCode);
    
    // Find and trigger the Google Translate select element
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = langCode;
      selectElement.dispatchEvent(new Event('change'));
    }
  };

  // Find the current language information
  const currentLangInfo = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <div className="relative">
      {/* Hidden Google Translate element */}
      <div id="google_translate_element" className="hidden" />
      
      {/* shadcn/ui dropdown menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1 px-3">
            <Globe className="h-4 w-4" />
            <span>{currentLangInfo.nativeName}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className="flex cursor-pointer items-center justify-between"
            >
              <span>{lang.nativeName}</span>
              {currentLanguage === lang.code && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Load the Google Translate script */}
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
        onLoad={() => console.log('Google Translate script loaded')}
      />
    </div>
  );
};

export default LanguageSwitcher;