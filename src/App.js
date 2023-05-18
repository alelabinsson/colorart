import React, { useState, useEffect, useRef } from 'react';
import { CirclePicker } from 'react-color';
import { MasonryGrid } from '@egjs/grid';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [artworks, setArtworks] = useState([]);
  const containerRef = useRef(null); // Reference to the grid container
  let grid = null; // Variable to store the grid instance

  // Tar hand om sökningarna
  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`https://api.smk.dk/api/v1/art/search?keys=${searchTerm}&offset=0&rows=15`);
    const data = await response.json();
    setArtworks(data.items);
    console.log(data.items[0]);
  };

  // Tar hand om färgerna
  const handleChangeComplete = async (color) => {
    try {
      const colorParam = encodeURIComponent(color.hex);
      const response = await fetch(`https://api.smk.dk/api/v1/art/search/?keys=*&filters=[has_image:true],[colors:${colorParam}]&offset=0&rows=24`);
      const data = await response.json();
      setArtworks(data.items);
      console.log(data.items[0]);
    } catch (error) {
      console.error(error);
    }
    console.log(color.hex);
  };

  useEffect(() => {
    // Re-render the grid when the artworks change
    if (grid) {
      grid.destroy();
    }

    if (containerRef.current) {
      grid = new MasonryGrid(containerRef.current, {
        gap: 20,
        useResizeObserver: true,
        observeChildren: true,
      });
      grid.renderItems();
    }
  }, [artworks]);


  // Ritar sidan
  return (
        <div className="circ">
        <CirclePicker
          width="100%"
          colors={['#44ab8c', '#017079', '#8a82b2', '#0e3b59', '#b93530', '#95253c', '#EB626D']}
          circleSize={80}
          heigth="100px"
          onChangeComplete={handleChangeComplete} />
        {/* <form onSubmit={handleSubmit}>
          <label>
            Search term:
            <input type="text" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </label>
          <button type="submit">Search</button>
        </form>
        <h1>Results</h1> */}
        <ul ref={containerRef}>
          {artworks &&
            artworks
              .filter(artwork => artwork.image_thumbnail)
              .filter(artwork => artwork.colors)
              .map((artwork) => (
                <li key={artwork.objectNumber || artwork.id}>
                  <img data-grid-lazy="true" src={artwork.image_thumbnail} alt={artwork.title} style={{ width: '300px' }} loading="lazy" />
                  <p className="titleText">{artwork.titles[0].title}</p>
                </li>
              ))}
        </ul>
      </div>
  );
}

export default App;