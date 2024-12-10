const AbstractBackground = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute top-0 left-0 w-64 h-64 text-white/40 blur-sm transform -translate-x-1/2 -translate-y-1/2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,74.1,43.2C66.7,57.2,57.6,70.6,45,78.3C32.4,86,16.2,88,-0.4,88.7C-17,89.4,-34,88.8,-47.1,81.2C-60.2,73.6,-69.4,59,-76.4,43.9C-83.3,28.8,-88,14.4,-88.2,-0.1C-88.4,-14.6,-84.1,-29.2,-76.8,-42.2C-69.5,-55.2,-59.1,-66.6,-46.3,-74.4C-33.4,-82.2,-16.7,-86.4,-0.6,-85.4C15.5,-84.4,30.9,-78.2,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
        <svg className="absolute bottom-0 right-0 w-64 h-64 text-white/40 blur-sm transform translate-x-1/2 translate-y-1/2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M39.9,-65.7C53.5,-59.8,67.7,-52.3,76.3,-40.9C84.9,-29.5,87.9,-14.7,86.7,-0.7C85.5,13.4,80.1,26.7,72.2,38.2C64.3,49.7,53.9,59.3,41.9,67.6C29.8,75.9,14.9,82.9,0.1,82.7C-14.7,82.6,-29.5,75.3,-43.5,67.3C-57.5,59.3,-70.8,50.6,-79.3,38.1C-87.8,25.6,-91.5,9.3,-89.9,-6.4C-88.2,-22.1,-81.1,-37.2,-70.9,-49.1C-60.6,-61,-47.1,-69.6,-33.8,-75.6C-20.5,-81.6,-10.2,-84.9,1.6,-87.6C13.5,-90.3,27,-91.4,39.9,-65.7Z" transform="translate(100 100)" />
        </svg>
      </div>
    )
  }
  
  export default AbstractBackground
  
  