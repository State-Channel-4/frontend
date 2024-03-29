"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

const CountdownTimer = ({ from }: { from: number }) => {
  const router = useRouter()
  return (
    <section className="h-[180px] w-[270px] overflow-hidden rounded-full lg:h-[300px] lg:w-[400px] xl:h-[360px] xl:w-[440px]">
      <motion.div
        initial={{ y: 0 }}
        animate={{
          y: [
            "-0.2%",
            "-9%",
            "-18%",
            "-27%",
            "-37%",
            "-46%",
            "-55%",
            "-64%",
            "-73%",
            "-82%",
            "-91%",
          ],
        }}
        onAnimationComplete={() => router.push("/discover")}
        transition={{
          duration: from,
          ease: [0.37, 0.09, 0.3, 1],
          delay: 0.6,
        }}
        className="relative flex flex-col items-center overflow-hidden"
      >
        {Array.from({ length: from + 1 }, (_, i) => from - i).map((num) => {
          return (
            <div key={num}>
              <h1 className="text-[180px] leading-[180px] lg:text-[280px] lg:leading-[250px] xl:text-[350px] xl:leading-[330px]">
                {num}
              </h1>

              <style jsx>{`
                h1 {
                  text-shadow: 0px 16px 8px rgba(9, 58, 12, 0.15);
                }
              `}</style>
            </div>
          )
        })}
      </motion.div>
    </section>
  )
}

export default CountdownTimer
