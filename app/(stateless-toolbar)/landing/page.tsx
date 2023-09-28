import Image from 'next/image'
import EthereumIcon from '/assets/ethereum-stroke.svg'

export default function Landing() {
  return (
    <main className="flex h-full flex-col bg-[hsl(124,61%,36%)] px-3 py-8">
      <article className="flex flex-col justify-center text-center">
        <p className="font-dm font-medium tracking-wide">THESE WEBSITES HAVE BEEN ADDED BY</p>
        <h3 className="text-4xl font-bold uppercase">users like you</h3>
        <div id="spacer" className="p-8"></div>
        <p className="font-dm text-sm font-medium tracking-wide">THIS PROJECT USES STATE CHANNELS & RANDOM CONTENT FOR YOUR ENTERTAINMENT</p>
        <div id="spacer" className="p-2"></div>
        <section>
          <div className="grid max-w-[360px] grid-cols-6 grid-rows-[1fr_2rem] border-2 border-primary">
            <div className="relative col-span-1 col-start-1 row-span-1 flex items-center justify-center border-r-2 border-primary text-primary">
              <Image src={EthereumIcon} width={21} height={32} alt={''} />
            </div>
            <div className="col-span-5 col-start-2 row-span-1 row-start-1 px-2 py-4">
              <h3 className="text-base font-bold uppercase">Ethereum technology</h3>
            </div>
            <div className="col-span-6 col-start-1 row-span-1 flex items-center justify-center border-t-2 border-primary">
              <p className="text-xs uppercase tracking-wide">GOOD VIBES ONLY (maybe)</p>
            </div>
          </div>
        </section>

      </article>

      <article>
        <h1>Timer</h1>
      </article>
    </main>

  )
}
