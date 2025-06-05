{darkMode && (
  <div className='flex justify-center'>
  <div
    ref={spaceRef}
    className="absolute  w-[700px] h-[850px]"
  >
    <Lottie
      animationData={space}
      loop
      autoplay
      style={{ height: "140%", width: "140%" }}
    />
  </div>
  </div>
)}
        
{!darkMode && (<div ref={bearScrollRef} className="absolute w-100vw flex align-middle ">
  <div ref={bearRef} className="w-[300px] h-[400px] absolute ">
    <Lottie
      animationData={flyingBear}
      loop={true}
      autoplay={true}
      style={{ width: '300%', height: '300%' }}
    />
  </div>
</div>)}