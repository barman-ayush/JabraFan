import {
    TrophyIcon,
    BrainIcon,
    CoinsIcon,
    UsersIcon,
    HeartIcon,
    MessageCircleIcon,
    PiggyBankIcon,
    AwardIcon
  } from "lucide-react";
  import { Item, ItemIcon, ItemTitle, ItemDescription } from "@/components/ui/item";
  import { ReactNode } from "react";
  
  interface FeatureProps {
    title: string;
    description: React.ReactNode;
    icon: ReactNode;
  }
  
  interface IPLPromoProps {
    title?: string;
    subtitle?: string;
    leftTitle?: string;
    rightTitle?: string;
    leftFeatures?: FeatureProps[];
    rightFeatures?: FeatureProps[];
    quote?: string;
  }
  
  export default function IPLPromo({
    title = "As IPL grows, so do you!",
    subtitle = "Engage, Predict & earn with JabraFan",
    leftTitle = "Think You Know the Game?",
    rightTitle = "Win Big!!",
    leftFeatures = [
      {
        title: "Experience IPL Like Never Before",
        description: (
          <>
            Put your cricket instincts to the test by answering questions like "Who will be today's top scorer?" and compete with fans across the globe. 🏏
          </>
        ),
        icon: <BrainIcon className="size-5 stroke-1" />,
      },
      {
        title: "Earn Real Rewards",
        description: (
          <>
            Every correct prediction earns you points that you can convert directly into cash rewards. Climb the leaderboard, feel the thrill of every match, and get paid for your cricket smarts! 💰
          </>
        ),
        icon: <CoinsIcon className="size-5 stroke-1" />,
      },
      {
        title: "Cash-Winning Opportunity",
        description: (
          <>
            Turn every game into a cash-winning opportunity—predict, play, and cash out! ✨
          </>
        ),
        icon: <PiggyBankIcon className="size-5 stroke-1" />,
      }
    ],
    rightFeatures = [
      {
        title: "Celebrate Your Passion for IPL!",
        description: (
          <>
            Get ready to turn your cricket knowledge into real cash! Our Rewards Feature lets you win exciting cash prizes every time you play. From predicting match outcomes to dominating fan contests, every moment is a chance to earn big.
          </>
        ),
        icon: <TrophyIcon className="size-5 stroke-1" />,
      },
      {
        title: "How It Works:",
        description: (
          <>
            Join our prediction games or trivia challenges to start earning points. Rack up points as you play and convert them into cash rewards. The more you engage, the closer you get to cashing out your winnings!
          </>
        ),
        icon: <AwardIcon className="size-5 stroke-1" />,
      }
    ],
    quote = "And of course, if we get enough love and engagement from you, we'll keep the excitement going by adding even more fun features like Fan of the Match, community conversations, Fan Feud challenges, and bigger prizes to make the experience even better!"
  }: IPLPromoProps) {
    return (
      <div className="py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-medium text-muted-foreground leading-tight">
              {title}<br /><span className="text-foreground">{subtitle}</span>
            </h2>
            <div className="mt-6 border-t border-muted w-24 mx-auto"></div>
          </div>
  
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              <h3 className="text-2xl font-medium text-muted-foreground mb-4">
                {leftTitle}
              </h3>
              <div className="space-y-6">
                {leftFeatures.map((feature, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <ItemIcon>{feature.icon}</ItemIcon>
                      </div>
                      <ItemTitle className="text-lg font-medium">
                        {feature.title} {index === 0 && <span className="text-amber-500">👌</span>}
                      </ItemTitle>
                    </div>
                    <ItemDescription className="pl-12 text-sm">
                      {feature.description}
                    </ItemDescription>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Right Column */}
            <div className="bg-muted/30 p-5 rounded-lg">
              <h3 className="text-2xl font-medium text-muted-foreground mb-4">
                {rightTitle}
              </h3>
              <div className="space-y-6">
                {rightFeatures.map((feature, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <ItemIcon>{feature.icon}</ItemIcon>
                      </div>
                      <ItemTitle className="text-lg font-medium">
                        {feature.title} {index === 0 && <span className="text-primary">🎉</span>}
                      </ItemTitle>
                    </div>
                    <ItemDescription className="pl-12 text-sm">
                      {feature.description}
                    </ItemDescription>
                  </div>
                ))}
              </div>
            </div>
          </div>
  
          {quote && (
            <div className="mt-10 text-center max-w-5xl mx-auto">
              <p className="text-muted-foreground italic text-sm">
                "{quote}"
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }