import React, { useState, useEffect, useRef } from 'react';
import {Chart,LinearScale } from 'chart.js/auto';
import apiService from './services/api';
import { Link } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';

const ScoreSentiment = () => {
  const [sentimentScores, setSentimentScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const data = await apiService.getQuizResults();
        const results = data.quiz_results || [];
        
        // Transform backend data to match expected format
        const scores = results.map(result => ({
          id: result.id,
          score: result.score,
          maxScore: result.max_score,
          sentiment: calculateSentiment(result.score)
        }));
        
        setSentimentScores(scores);
      } catch (error) {
        console.error('Error fetching quiz results: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizResults();
  }, []);

  const calculateSentiment = (score) => {
    if (score < 5 && score !== 0) return 'negative';
    if (score > 5) return 'positive';
    return 'neutral';
  };

  const canvasRef = useRef(null);

  useEffect(() => {
    if (sentimentScores.length > 0 && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const labels = ['Positive', 'Neutral', 'Negative'];
      const data = [
        sentimentScores.filter(score => score.score > 5 ).length,
        sentimentScores.filter(score => score.score === 0).length,
        sentimentScores.filter(score => score.score < 5 && score.score !== 0).length,
      ];
      const backgroundColors = [
        'rgba(75, 192, 205)',
        'rgba(255, 234, 132)',
        'rgba(255, 22, 55)',
      ];
      const borderColors = [
        'rgba(255, 255, 255)',
        'rgba(255, 255, 255)',
        'rgba(255, 255, 255)',
      ];

      Chart.register(LinearScale);
      Chart.defaults.font.family = 'Arial';
      Chart.defaults.font.size = 16;
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Sentiment Analysis Score',
              data,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 3,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  size: 18,
                  weight: 'bold'
                }
              }
            },
            title: {
              display: true,
              text: 'Sentiment Analysis Scores',
              font: {
                size: 24,
                weight: 'bold'
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                font: {
                  size: 14,
                  weight: 'bold'
                }
              },
              grid: {
                display: false
              }
            },
            x: {
              ticks: {
                font: {
                  size: 14,
                  weight: 'bold'
                }
              },
              grid: {
                display: false
              }
            }
          }
        },
      });

      return () => {
        chart.destroy();
      };
    }
  }, [sentimentScores]);

  return (
    <div>
      {/* <h2>Sentiment Scores</h2> */}
      {/* <ul>
        {sentimentScores.map((score) => (
          <li key={score.id}>
            Score: {score.score} - Sentiment: {score.sentiment}
          </li>
        ))}
      </ul> */}{" "}
      <Link to="/quiz">
        <BsArrowLeft /> Back
      </Link>
      <canvas ref={canvasRef} style={{ width: "50%", height: "auto" }}></canvas>
    </div>
  );
};

export default ScoreSentiment;
