

export default function Landing() {
  return (
    <main className="flex h-full flex-col bg-[hsl(124,61%,36%)] px-3 py-8">
      <article className="text-center">
        <p className="font-dm text-sm font-medium tracking-wide">THESE WEBSITES HAVE BEEN ADDED BY</p>
        <h3 className="text-2xl font-bold uppercase">users like you</h3>
        <div id="spacer" className="p-8"></div>
        <p className="font-dm text-sm font-medium tracking-wide">THIS PROJECT USES STATE CHANNELS & RANDOM CONTENT TO MAKE YOU HAPPY</p>
        <div id="spacer" className="p-2"></div>
        <section>
            <div className="grid max-w-[400px] grid-cols-6 grid-rows-2 border border-primary">
              <div className="col-span-1 col-start-1 row-span-1 border-r border-primary">Icon</div>
              <div className="col-span-5 col-start-2 row-span-1 row-start-1 p-2">
                <h3 className="text-base font-bold uppercase">Ethereum technology</h3>
              </div>
              <div className="col-span-6 col-start-1 row-span-1 border-t border-primary">for all ages</div>

          </div>
        </section>

      </article>

      <article>
        <h1>Timer</h1>
      </article>
    </main>

  )
}
