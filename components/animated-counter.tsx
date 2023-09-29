'use client'
import { motion } from 'framer-motion'


const CountdownTimer = ({ from }: { from: number }) => {
  return (
    <section className='h-[180px] w-[270px] overflow-hidden rounded-full lg:h-[300px] lg:w-[400px] xl:h-[360px] xl:w-[440px]'>
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: "-91.42%" }}
        transition={{
          duration: from,
          ease: [0.42, 0, 0.58, 1],
          times: [0, 0.2, 0.5, 0.8, 1],
          delay: 0.1
        }}
        className='relative flex flex-col items-center overflow-hidden'
      >
        {Array.from({ length: from + 1 }, (_, i) => from - i).map((num) => (
          <div key={num}>
            <h1 className='text-[180px] leading-[180px] lg:text-[280px] lg:leading-[250px] xl:text-[350px] xl:leading-[330px]'>{num}</h1>

            <style jsx>{`
            h1 {
              text-shadow: 0px 16px 8px rgba(9, 58, 12, 0.15);
            }
          `}</style></div>
        ))}
      </motion.div>
    </section>
  )
}

export default CountdownTimer