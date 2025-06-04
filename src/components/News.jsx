import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export default function News() {

const [news,setNews] = useState();
const [loading,setloading] = useState(true);
const navigate = useNavigate()


useEffect(() =>{
    
    const getNews = async () => {
        try{
           
            const apikey = import.meta.env.VITE_NEWSDATA_API_KEY;
            if (!apikey) return alert('API key is missing');

            const newsData = await axios.get(`https://newsdata.io/api/1/news?apikey=${apikey}&q=weather&language=en`)
            console.log(newsData.data)
            setNews(newsData.data.results || [])
            setloading(false);


        } catch(error){
            console.error("news not fetched",error);
            alert('News not found!!!');
            setloading(false)
        }
        
    } 
    getNews()
},[])

 if (loading) return <p>Loading news...</p>;
  if (news.length === 0) return <p>No news found.</p>;


    return (
        <>
           <div className="min-h-screen bg-gradient-to-br from-[#f9f5ff] via-[#d7e7ff] to-[#f3faff] px-6 py-12">
            <button 
            className="bg-blue-700 w-23 font-bold h-10 text-2xl text-cyan-100 rounded-3xl hover:scale-[1.20] transition-all" onClick={()=> navigate("/")}>Home</button>
  <h1 className="text-5xl font-extrabold text-center text-[#0f172a] mb-12 drop-shadow-xl tracking-tight animate-fade-in">
    ⚡ Trending Weather News
  </h1>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 max-w-7xl mx-auto">
    {news.map((item, index) => (
      <div
        key={index}
        className="relative bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.15)] transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 group border-2 border-[#e0e7ff]"
      >
        <div className="overflow-hidden h-52">
          <img
            src={item.image_url || "https://via.placeholder.com/400x300"}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
          />
        </div>

        <div className="p-5">
          <span className="text-xs uppercase tracking-wider text-[#7c3aed] font-bold">
            {new Date(item.pubDate).toDateString()}
          </span>
          <h2 className="mt-2 text-lg font-bold text-[#111827] group-hover:text-[#4f46e5] line-clamp-2">
            {item.title}
          </h2>
          <p className="mt-2 text-sm text-gray-600 line-clamp-3">{item.description}</p>

          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-[#4f46e5] font-medium hover:underline"
          >
            Read Full Article →
          </a>
        </div>

        <div className="absolute top-0 right-0 bg-[#4f46e5] text-white px-3 py-1 rounded-bl-2xl text-xs font-semibold">
          WEATHER
        </div>
      </div>
    ))}
  </div>
</div>

    </>
    )
}