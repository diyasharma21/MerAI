"use client";
import Link from "next/link"
import { Button } from "./ui/button"
import Image from "next/image";
import { useEffect, useRef} from "react"


const HeroSection = () => {
    const imageRef=useRef(null);

    useEffect(() => {
        const imageElement = imageRef.current;

        const handleScroll = () =>{
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;

            if(scrollPosition > scrollThreshold){
                imageElement.classList.add("scrolled")
            }
             else {
              imageElement.classList.remove("scrolled");
            }
        }

        window.addEventListener("scroll", handleScroll) 
        return () => window.removeEventListener("scroll", handleScroll);
    },[])



  return (
    <section className="w-full pt-36 md:pt-48 pb-10">
      <div className="space-y-6 text-center">
        <div className="space-y-6 mx-auto">
            <h1 className="text-5xl font-bold md:text-6xl 
            lg:text-7xl zl:text-8xl gradient-title">
                AI-Powered Guide to
                <br />
                Career Excellence
            </h1>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-l ">
                Boost your career with personalized mentorship, tailored interview prep and
                AI-powered career tools for Dream Jobs.
            </p>
        </div>
      </div>

      {/* Buttons container with margin bottom for gap */}
      <div className="flex justify-center gap-4 mt-4 mb-4">
        <Link href="/dashboard">
          <Button size="lg" className="px-8">
            Begin Your Journey
          </Button>
        </Link> 
        <Link href="/dashboard">
          <Button size="lg" className="px-8" variant="outline">
            Watch a Demo
          </Button>
        </Link> 
      </div>

      {/* Image section */}
      <div className="hero-image-wrapper mt-5 md:mt-0">
        <div ref={imageRef} className="hero-image">
          <Image
            src={"/h5.jpg"}
            width={1280}
            height={720}
            alt="Banner MerAi"
            className="rounded-lg shadow-2xl border mx-auto"
            priority
          />
        </div>
      </div>
    </section>
  )
}

export default HeroSection