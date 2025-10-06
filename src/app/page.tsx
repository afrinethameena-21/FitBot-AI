import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "lucide-react"
import Link from "next/link";
import Image from "next/image";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden">
      <section className="relative z-10 pt-16 flex-grow">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            
            {/* Left side content */}
            <div className="lg:col-span-7 space-y-8 relative">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <div>
                  <span className="text-foreground"> Transform</span>
                </div>
                <div>
                  <span className="text-[#BF00FF]"> Your Body</span>
                </div>
                <div className="pt-2">
                  <span className="text-foreground"> With</span>
                </div>
                <div className="pt-2">
                  <span className="text-[#BF00FF]"> AI</span>
                  <span> Technology</span>
                </div>
              </h1>

              {/* separator */}
              <div className="h-px w-full bg-gradient-to-r from-primary via-secondary to-primary opacity-50"></div>

              <p className="text-xl text-muted-foreground w-2/3">
                Talk to your AI assistant and get personalised diet plans and workout routine<br />
                designed just for you.
              </p>

              {/* Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  size="lg"
                  asChild
                  className="overflow-hidden bg-[#BF00FF] text-white px-8 py-6 text-lg font-medium hover:bg-[#9A00CC]"
                >
                  <Link href="/generate-program" className="flex items-center font-mono">
                    Build Your Program
                    <ArrowRightIcon className="ml-2 size-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right side content */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative aspect-square max-w-md w-full">
                <div className="relative overflow-hidden rounded-lg bg-cyber-black">
                  <Image
  src="/ai-avatar.jpg"
  alt="AI Fitness Coach"
  width={400}
  height={400}
  className="object-cover object-center opacity-85"
/>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
