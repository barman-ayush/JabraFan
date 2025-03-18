// components/Footer.tsx
import Link from "next/link";

export function FooterSection() {
  return (
    <footer className="w-full">
      {/* Upper section (white background) */}
      <div className="w-full bg-background border-t border-border py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-medium text-muted-foreground mb-10">Contact Us</h2>
          
          <div className="border-t border-muted w-24 mx-auto mb-10"></div>
          
          <h3 className="text-xl font-medium text-foreground mb-6">
            Would you like to provide your valuable feedback?
          </h3>
          
          <p className="text-muted-foreground mb-6">
            As the most passionate cricket-loving nation in the world, we understand that many of you have fantastic ideas for the sport.
          </p>
          
          <p className="text-muted-foreground mb-10">
            If there's any feature you'd like to see, please let us know. Just send a message to the email below and rest assured, we will do our utmost to fulfill your request.
          </p>
          
          <p className="text-foreground font-medium text-lg mb-4">JabraFan</p>
          
          <a 
            href="mailto:jabrafansindia@jabrafans.com" 
            className="text-primary hover:text-primary/80 transition-colors"
          >
            jabrafansindia@jabrafans.com
          </a>
        </div>
      </div>
      
      {/* Lower section (black background) */}
      <div className="w-full bg-black py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <Link 
            href="/privacy-policy"
            className="text-white/80 hover:text-white text-sm uppercase tracking-wider transition-colors"
          >
            PRIVACY POLICY
          </Link>
          
          <p className="text-white/80 text-sm">JabraFans</p>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;