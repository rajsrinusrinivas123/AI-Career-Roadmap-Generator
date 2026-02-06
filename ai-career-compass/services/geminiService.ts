
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, RoadmapResponse } from "../types";

export const generateRoadmap = async (profile: UserProfile): Promise<RoadmapResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Generate a comprehensive 60-day AI career roadmap for a user transitioning from ${profile.currentRole} to ${profile.targetRole}. 
  Current skills: ${profile.skills}. 
  Weekly commitment: ${profile.weeklyHours} hours.
  
  Please provide:
  1. A skill gap analysis (current vs target level 0-100).
  2. A day-by-day 60-day plan.
  3. 3-5 Tailored Capstone projects. For each project, outline:
     - Key skills involved.
     - Potential challenges they might face.
     - How it specifically contributes to their goal of becoming a ${profile.targetRole}.
  4. Top 3 online courses.
  5. A summary of the path.
  
  Ensure projects leverage existing skills: "${profile.skills}" while introducing new critical AI competencies.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 4000 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          careerPath: { type: Type.STRING },
          summary: { type: Type.STRING },
          skillAnalysis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                skill: { type: Type.STRING },
                current: { type: Type.NUMBER },
                target: { type: Type.NUMBER }
              },
              required: ["skill", "current", "target"]
            }
          },
          sixtyDayPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.NUMBER },
                topic: { type: Type.STRING },
                description: { type: Type.STRING },
                resources: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["day", "topic", "description"]
            }
          },
          recommendedCourses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                provider: { type: Type.STRING },
                url: { type: Type.STRING }
              }
            }
          },
          capstoneProjects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                keySkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                potentialChallenges: { type: Type.STRING },
                careerContribution: { type: Type.STRING },
                complexity: { type: Type.STRING }
              },
              required: ["title", "description", "techStack", "keySkills", "potentialChallenges", "careerContribution", "complexity"]
            }
          }
        },
        required: ["careerPath", "skillAnalysis", "sixtyDayPlan", "capstoneProjects", "summary"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from AI");
  return JSON.parse(text) as RoadmapResponse;
};
