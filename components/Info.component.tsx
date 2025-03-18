import {
    TrophyIcon,
    BrainIcon,
    CoinsIcon,
    UsersIcon,
    HeartIcon,
    MessageCircleIcon,
    PiggyBankIcon,
    AwardIcon,
    SparklesIcon
  } from "lucide-react";
  import { Item, ItemIcon, ItemTitle, ItemDescription } from "@/components/ui/item";
  import { ReactNode } from "react";
  import { motion } from "framer-motion";
  
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
    // Animation variants
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2,
          delayChildren: 0.3
        }
      }
    };
  
    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: { 
        y: 0, 
        opacity: 1,
        transition: { 
          type: "spring", 
          stiffness: 100,
          damping: 10
        }
      }
    };
  
    const titleVariants = {
      hidden: { scale: 0.9, opacity: 0 },
      visible: {
        scale: 1,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 100,
          delay: 0.1
        }
      }
    };
  
    // Define separate animations for shimmer effect
    const shimmerAnimation = {
      x: ["-100%", "200%"],
      opacity: [0, 1, 0], 
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop" as const,
          duration: 3,
          ease: "easeInOut"
        },
        opacity: {
          repeat: Infinity,
          repeatType: "loop" as const,
          duration: 3,
          times: [0, 0.5, 1],
          ease: "easeInOut"
        }
      }
    };
  
    return (
      <div className="py-12 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={titleVariants}
          >
            <motion.h2 
              className="text-3xl md:text-5xl font-bold text-muted-foreground leading-tight"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {title}<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                {subtitle}
              </span>
            </motion.h2>
            <motion.div 
              className="mt-6 border-t border-primary w-24 mx-auto"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            ></motion.div>
          </motion.div>
  
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <motion.div
              className="relative rounded-xl p-1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={containerVariants}
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/30 to-primary/5 blur-sm"></div>
              <div className="relative bg-background/80 backdrop-blur-sm rounded-lg p-6 border border-primary/20 shadow-lg">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent -skew-x-12"
                  initial={{ opacity: 0, x: "-100%" }}
                  animate={shimmerAnimation}
                ></motion.div>
                
                <motion.h3 
                  className="text-2xl font-bold text-foreground mb-6 flex items-center"
                  variants={itemVariants}
                >
                  <SparklesIcon className="mr-2 text-primary h-5 w-5" />
                  {leftTitle}
                </motion.h3>
                
                <div className="space-y-8">
                  {leftFeatures.map((feature, index) => (
                    <motion.div 
                      key={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <motion.div 
                          className="bg-primary/10 p-3 rounded-lg shadow-md group-hover:bg-primary/20"
                          whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <ItemIcon>{feature.icon}</ItemIcon>
                        </motion.div>
                        <ItemTitle className="text-lg font-bold text-foreground">
                          {feature.title} {index === 0 && <span className="text-amber-500">👌</span>}
                        </ItemTitle>
                      </div>
                      <ItemDescription className="pl-14 text-sm text-muted-foreground">
                        {feature.description}
                      </ItemDescription>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
  
            {/* Right Column */}
            <motion.div
              className="relative rounded-xl p-1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={containerVariants}
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-500/30 to-primary/10 blur-sm"></div>
              <div className="relative bg-muted/80 backdrop-blur-sm rounded-lg p-6 border border-amber-500/20 shadow-lg">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent -skew-x-12"
                  initial={{ opacity: 0, x: "-100%" }}
                  animate={shimmerAnimation}
                ></motion.div>
                
                <motion.h3 
                  className="text-2xl font-bold text-foreground mb-6 flex items-center"
                  variants={itemVariants}
                >
                  <SparklesIcon className="mr-2 text-amber-500 h-5 w-5" />
                  {rightTitle}
                </motion.h3>
                
                <div className="space-y-8">
                  {rightFeatures.map((feature, index) => (
                    <motion.div 
                      key={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <motion.div 
                          className="bg-amber-500/10 p-3 rounded-lg shadow-md group-hover:bg-amber-500/20"
                          whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <ItemIcon>{feature.icon}</ItemIcon>
                        </motion.div>
                        <ItemTitle className="text-lg font-bold text-foreground">
                          {feature.title} {index === 0 && <span className="text-amber-500">🎉</span>}
                        </ItemTitle>
                      </div>
                      <ItemDescription className="pl-14 text-sm text-muted-foreground">
                        {feature.description}
                      </ItemDescription>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
  
          {quote && (
            <motion.div 
              className="mt-12 text-center max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <p className="text-muted-foreground italic text-sm md:text-base px-4 py-3 border-l-4 border-primary/50 bg-primary/5 rounded-r-lg">
                "{quote}"
              </p>
            </motion.div>
          )}
        </div>
      </div>
    );
  }