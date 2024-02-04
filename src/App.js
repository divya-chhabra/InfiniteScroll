import React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios"; 
import './App.css';

const App = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const loaderRef = useRef(null);

  const Total_Records = 60;

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api.escuelajs.co/api/v1/products?offset=${index}&limit=12`
      );
      let all = new Set([...items, ...response.data]);
      setItems([...all]);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
    setIsFirstPage(false);
  }, [index]);

  useEffect(() => {
    if(!loaderRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      console.log(target)
      if (target.isIntersecting && !isFirstPage && index < Total_Records) {
        setIndex( prevIndex => prevIndex + 12);
      }
    }, {threshold:1});

      observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [items]);

  return (
    <div className='App'>
      
      
        { items.length>0 && items.map((item, index) => (
          <div className="data-card" key={item.id}>
            <img src={item.images[0]} alt={item.title}/>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      
      <div ref={loaderRef}>{isLoading && <h2>Loading...</h2>}</div>
    </div>
  );
};

export default App;
