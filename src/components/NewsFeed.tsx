import React, { useState, useEffect } from 'react';

import './NewsFeed.css';
import { getNews } from '../services/apiService';

interface NewsArticle {
  url: string;
  urlToImage: string;
  title: string;
  description: string;
  source: {
    name: string;
  };
  publishedAt: string;
}

const cleanupDescription = (description: string): string => {
  if (!description) {
    return '';
  }

  // Remove HTML-like tags using a regular expression
  let cleanText = description.replace(/<[^>]*>/g, '');

  // Remove extra whitespace and line breaks
  cleanText = cleanText.replace(/\s+/g, ' ').trim();

  // Truncate to 100 characters
  if (cleanText.length > 100) {
    cleanText = cleanText.substring(0, 100).trim() + '...';
  }

  return cleanText;
};



const NewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const newsData = await getNews();
        setNews(newsData);
      } catch (err) {
        setError('Failed to fetch news.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <div>Loading news...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="news-feed-container">
      <h2 className="text-2xl font-bold mb-4">Notícias Relevantes</h2>
      <div className="grid grid-cols-1 gap-4">
        {news.map((article, index) => {
          return (
            <a href={article.url} key={index} target="_blank" rel="noopener noreferrer" className="flex items-start space-x-2 p-2 border rounded-lg hover:bg-gray-100 transition-colors">
              <img src={article.urlToImage || 'https://placehold.co/400x200'} alt={article.title} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-xs mb-1">{article.title}</h3>
                <p className="text-xs text-gray-700 mb-2">{cleanupDescription(article.description)}</p>
                <p className="text-xs text-gray-500">{article.source.name} - {new Date(article.publishedAt).toLocaleDateString()}</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default NewsFeed;