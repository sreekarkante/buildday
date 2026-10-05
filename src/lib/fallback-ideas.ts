export interface BlueprintStep {
  time: string;
  step: string;
  tools: string;
}

export interface ProjectIdea {
  title: string;
  pitch: string;
  outcome: string;
  blueprint: BlueprintStep[];
}

export const FALLBACK_IDEAS: Record<string, ProjectIdea[]> = {
  "CSE - Computer Science": [
    {
      "title": "AI Code Reviewer",
      "pitch": "A tool that automatically reviews code snippets for bugs and style issues.",
      "outcome": "A fully working AI prototype you can link directly on your resume.",
      "blueprint": [
        {
          "time": "0-10 min",
          "step": "Environment Setup: Set up a simple text area for code input.",
          "tools": "VScode, Next.js"
        },
        {
          "time": "10-35 min",
          "step": "Core Logic: Connect to an LLM API to analyze the code.",
          "tools": "Gemini API, Supabase"
        },
        {
          "time": "35-50 min",
          "step": "UI & Refinement: Display suggestions and highlight potential bugs.",
          "tools": "Tailwind CSS"
        },
        {
          "time": "50-60 min",
          "step": "Demo & Deploy: Deploy using Vercel.",
          "tools": "Vercel"
        }
      ]
    },
    {
      "title": "Automated Documentation Generator",
      "pitch": "Generate README files and inline docs from source code automatically.",
      "outcome": "A fully working AI prototype you can link directly on your resume.",
      "blueprint": [
        {
          "time": "0-10 min",
          "step": "Environment Setup: Parse uploaded source files.",
          "tools": "VScode, Next.js"
        },
        {
          "time": "10-35 min",
          "step": "Core Logic: Extract function signatures and comments.",
          "tools": "Gemini API, Supabase"
        },
        {
          "time": "35-50 min",
          "step": "UI & Refinement: Use AI to generate readable documentation.",
          "tools": "Tailwind CSS"
        },
        {
          "time": "50-60 min",
          "step": "Demo & Deploy: Export as Markdown.",
          "tools": "Vercel"
        }
      ]
    },
    {
      "title": "Smart Bug Tracker",
      "pitch": "AI categorizes and prioritizes bug reports based on text descriptions.",
      "outcome": "A fully working AI prototype you can link directly on your resume.",
      "blueprint": [
        {
          "time": "0-10 min",
          "step": "Environment Setup: Create a submission form for bugs.",
          "tools": "VScode, Next.js"
        },
        {
          "time": "10-35 min",
          "step": "Core Logic: Use text classification to assign severity.",
          "tools": "Gemini API, Supabase"
        },
        {
          "time": "35-50 min",
          "step": "UI & Refinement: Dashboard to view categorized bugs.",
          "tools": "Tailwind CSS"
        },
        {
          "time": "50-60 min",
          "step": "Demo & Deploy: Implement search and filtering.",
          "tools": "Vercel"
        }
      ]
    }
  ],
  "IT - Information Technology": [
    {
      "title": "IT Ticket Resolver Bot",
      "pitch": "An AI chatbot that solves common IT helpdesk tickets automatically.",
      "outcome": "A fully working AI prototype you can link directly on your resume.",
      "blueprint": [
        {
          "time": "0-10 min",
          "step": "Environment Setup: Set up a chat interface.",
          "tools": "VScode, Next.js"
        },
        {
          "time": "10-35 min",
          "step": "Core Logic: Create a knowledge base of common IT issues.",
          "tools": "Gemini API, Supabase"
        },
        {
          "time": "35-50 min",
          "step": "UI & Refinement: Use vector search to find solutions.",
          "tools": "Tailwind CSS"
        },
        {
          "time": "50-60 min",
          "step": "Demo & Deploy: Provide step-by-step resolution to users.",
          "tools": "Vercel"
        }
      ]
    },
    {
      "title": "Network Log Analyzer",
      "pitch": "Detect anomalies in server logs using machine learning.",
      "outcome": "A fully working AI prototype you can link directly on your resume.",
      "blueprint": [
        {
          "time": "0-10 min",
          "step": "Environment Setup: Upload sample server logs.",
          "tools": "VScode, Next.js"
        },
        {
          "time": "10-35 min",
          "step": "Core Logic: Parse logs into a structured format.",
          "tools": "Gemini API, Supabase"
        },
        {
          "time": "35-50 min",
          "step": "UI & Refinement: Use basic ML to flag unusual patterns.",
          "tools": "Tailwind CSS"
        },
        {
          "time": "50-60 min",
          "step": "Demo & Deploy: Display alerts on a dashboard.",
          "tools": "Vercel"
        }
      ]
    },
    {
      "title": "Cloud Cost Optimizer",
      "pitch": "Analyze cloud billing data to recommend cost-saving measures.",
      "outcome": "A fully working AI prototype you can link directly on your resume.",
      "blueprint": [
        {
          "time": "0-10 min",
          "step": "Environment Setup: Import billing CSV data.",
          "tools": "VScode, Next.js"
        },
        {
          "time": "10-35 min",
          "step": "Core Logic: Categorize spending by service.",
          "tools": "Gemini API, Supabase"
        },
        {
          "time": "35-50 min",
          "step": "UI & Refinement: Use AI to suggest cheaper alternatives or idle resource shutdown.",
          "tools": "Tailwind CSS"
        },
        {
          "time": "50-60 min",
          "step": "Demo & Deploy: Generate a savings report.",
          "tools": "Vercel"
        }
      ]
    }
  ],
  "ECE - Electronics & Communication": [
    {
      "title": "Circuit Diagram Explainer",
      "pitch": "Visualize and predict sensor failures using AI.",
      "outcome": "A fully working AI prototype you can link directly on your resume.",
      "blueprint": [
        {
          "time": "0-10 min",
          "step": "Environment Setup: Upload an image of a circuit diagram.",
          "tools": "VScode, Next.js"
        },
        {
          "time": "10-35 min",
          "step": "Core Logic: Store data in Supabase.",
          "tools": "Gemini API, Supabase"
        },
        {
          "time": "35-50 min",
          "step": "UI & Refinement: Use AI to explain the components and logic based on trends.",
          "tools": "Tailwind CSS"
        },
        {
          "time": "50-60 min",
          "step": "Demo & Deploy: Build a real-time dashboard.",
          "tools": "Vercel"
        }
      ]
    },
    {
      "title": "Signal Noise Filter",
      "pitch": "An AI tool that removes background noise from audio signals.",
      "outcome": "A fully working AI prototype you can link directly on your resume.",
      "blueprint": [
        {
          "time": "0-10 min",
          "step": "Environment Setup: Allow users to upload noisy audio files.",
          "tools": "VScode, Next.js"
        },
        {
          "time": "10-35 min",
          "step": "Core Logic: Process audio using a pre-trained ML model.",
          "tools": "Gemini API, Supabase"
        },
        {
          "time": "35-50 min",
          "step": "UI & Refinement: Provide a comparison player for original vs. cleaned audio.",
          "tools": "Tailwind CSS"
        },
        {
          "time": "50-60 min",
          "step": "Demo & Deploy: Export the clean file.",
          "tools": "Vercel"
        }
      ]
    },
    {
      "title": "Smart Home Energy Manager",
      "pitch": "Optimize home appliance energy usage based on patterns.",
      "outcome": "A fully working AI prototype you can link directly on your resume.",
      "blueprint": [
        {
          "time": "0-10 min",
          "step": "Environment Setup: Create a dashboard for mock appliances.",
          "tools": "VScode, Next.js"
        },
        {
          "time": "10-35 min",
          "step": "Core Logic: Input daily usage patterns.",
          "tools": "Gemini API, Supabase"
        },
        {
          "time": "35-50 min",
          "step": "UI & Refinement: AI suggests an optimized schedule to save power.",
          "tools": "Tailwind CSS"
        },
        {
          "time": "50-60 min",
          "step": "Demo & Deploy: Display cost savings.",
          "tools": "Vercel"
        }
      ]
    }
  ],
  "EEE - Electrical & Electronics": [
    {
      "title": "Power Grid Load Predictor",
      "pitch": "Forecast electrical load demand using historical data and AI.",
      "outcome": "A fully working AI prototype you can link directly on your resume.",
      "blueprint": [
        {
          "time": "0-10 min",
          "step": "Environment Setup: Collect mock historical load data.",
          "tools": "VScode, Next.js"
        },
        {
          "time": "10-35 min",
          "step": "Core Logic: Train a simple regression model.",
          "tools": "Gemini API, Supabase"
        },
        {
          "time": "35-50 min",
          "step": "UI & Refinement: Predict next 24 hours of demand.",
          "tools": "Tailwind CSS"
        },
        {
          "time": "50-60 min",
          "step": "Demo & Deploy: Visualize with charts.",
          "tools": "Vercel"
        }
      ]
    },
    {
      "title": "Solar Panel Output Estimator",
      "pitch": "Predict solar energy generation based on weather forecasts.",
      "outcome": "A fully working AI prototype you can link directly on your resume.",
      "blueprint": [
        {
          "time": "0-10 min",
          "step": "Environment Setup: Integrate a free weather API.",
          "tools": "VScode, Next.js"
        },
        {
          "time": "10-35 min",
          "step": "Core Logic: Calculate expected solar irradiance.",
          "tools": "Gemini API, Supabase"
        },
        {
          "time": "35-50 min",
          "step": "UI & Refinement: Estimate power output for a given panel size.",
          "tools": "Tailwind CSS"
        },
        {
          "time": "50-60 min",
          "step": "Demo & Deploy: Display daily forecast.",
          "tools": "Vercel"
        }
      ]
    },
    {
      "title": "Appliance Load Calculator",
      "pitch": "Estimate the remaining lifespan of battery storage systems.",
      "outcome": "A fully working AI prototype you can link directly on your resume.",
      "blueprint": [
        {
          "time": "0-10 min",
          "step": "Environment Setup: Type a list of home appliances.",
          "tools": "VScode, Next.js"
        },
        {
          "time": "10-35 min",
          "step": "Core Logic: Use ML to calculate total power load and suggest distribution.",
          "tools": "Gemini API, Supabase"
        },
        {
          "time": "35-50 min",
          "step": "UI & Refinement: Alert when health drops below a threshold.",
          "tools": "Tailwind CSS"
        },
        {
          "time": "50-60 min",
          "step": "Demo & Deploy: Suggest maintenance.",
          "tools": "Vercel"
        }
      ]
    }
  ],
  "AI/ML - Artificial Intelligence": [
    {
      "title": "Custom GPT Creator",
      "pitch": "A no-code tool to create custom AI assistants for specific tasks.",
      "outcome": "A fully working AI prototype you can link directly on your resume.",
      "blueprint": [
        {
          "time": "0-10 min",
          "step": "Environment Setup: Build a prompt-engineering UI.",
          "tools": "VScode, Next.js"
        },
        {
          "time": "10-35 min",
          "step": "Core Logic: Allow users to upload context documents.",
          "tools": "Gemini API, Supabase"
        },
        {
          "time": "35-50 min",
          "step": "UI & Refinement: Test the custom bot in a sandbox.",
          "tools": "Tailwind CSS"
        },
        {
          "time": "50-60 min",
          "step": "Demo & Deploy: Provide an embed code.",
          "tools": "Vercel"
        }
      ]
    },
    {
      "title": "Image Style Transfer Web App",
      "pitch": "Apply famous artistic styles to user-uploaded photos.",
      "outcome": "A fully working AI prototype you can link directly on your resume.",
      "blueprint": [
        {
          "time": "0-10 min",
          "step": "Environment Setup: Set up image upload.",
          "tools": "VScode, Next.js"
        },
        {
          "time": "10-35 min",
          "step": "Core Logic: Connect to a style-transfer API or model.",
          "tools": "Gemini API, Supabase"
        },
        {
          "time": "35-50 min",
          "step": "UI & Refinement: Process and display the stylized image.",
          "tools": "Tailwind CSS"
        },
        {
          "time": "50-60 min",
          "step": "Demo & Deploy: Add download functionality.",
          "tools": "Vercel"
        }
      ]
    },
    {
      "title": "Sentiment Analysis API",
      "pitch": "A microservice that analyzes text sentiment for product reviews.",
      "outcome": "A fully working AI prototype you can link directly on your resume.",
      "blueprint": [
        {
          "time": "0-10 min",
          "step": "Environment Setup: Create an API endpoint for text input.",
          "tools": "VScode, Next.js"
        },
        {
          "time": "10-35 min",
          "step": "Core Logic: Process text to determine positive/neutral/negative sentiment.",
          "tools": "Gemini API, Supabase"
        },
        {
          "time": "35-50 min",
          "step": "UI & Refinement: Return a JSON response.",
          "tools": "Tailwind CSS"
        },
        {
          "time": "50-60 min",
          "step": "Demo & Deploy: Build a demo page to showcase it.",
          "tools": "Vercel"
        }
      ]
    }
  ],
  "MECH - Mechanical": [
    {
      "title": "Machine Manual Q&A",
      "pitch": "Predict machine breakdowns before they happen.",
      "outcome": "A fully working AI prototype you can link directly on your resume.",
      "blueprint": [
        {
          "time": "0-10 min",
          "step": "Environment Setup: Upload a PDF manual of a machine.",
          "tools": "VScode, Next.js"
        },
        {
          "time": "10-35 min",
          "step": "Core Logic: Chat with the manual to find troubleshooting steps.",
          "tools": "Gemini API, Supabase"
        },
        {
          "time": "35-50 min",
          "step": "UI & Refinement: Use AI to predict time-to-failure.",
          "tools": "Tailwind CSS"
        },
        {
          "time": "50-60 min",
          "step": "Demo & Deploy: Send email alerts.",
          "tools": "Vercel"
        }
      ]
    },
    {
      "title": "Material Selection Assistant",
      "pitch": "AI recommends the best materials for a specific engineering application.",
      "outcome": "A fully working AI prototype you can link directly on your resume.",
      "blueprint": [
        {
          "time": "0-10 min",
          "step": "Environment Setup: Create a form for mechanical requirements (stress, temp, etc.).",
          "tools": "VScode, Next.js"
        },
        {
          "time": "10-35 min",
          "step": "Core Logic: Query an AI to suggest suitable materials.",
          "tools": "Gemini API, Supabase"
        },
        {
          "time": "35-50 min",
          "step": "UI & Refinement: List pros and cons of each.",
          "tools": "Tailwind CSS"
        },
        {
          "time": "50-60 min",
          "step": "Demo & Deploy: Generate a final report.",
          "tools": "Vercel"
        }
      ]
    },
    {
      "title": "3D Print Optimizer",
      "pitch": "Analyze 3D models to suggest optimal print settings.",
      "outcome": "A fully working AI prototype you can link directly on your resume.",
      "blueprint": [
        {
          "time": "0-10 min",
          "step": "Environment Setup: Upload basic G-code or model specs.",
          "tools": "VScode, Next.js"
        },
        {
          "time": "10-35 min",
          "step": "Core Logic: AI suggests layer height and infill for strength vs. speed.",
          "tools": "Gemini API, Supabase"
        },
        {
          "time": "35-50 min",
          "step": "UI & Refinement: Estimate print time.",
          "tools": "Tailwind CSS"
        },
        {
          "time": "50-60 min",
          "step": "Demo & Deploy: Provide cost estimation.",
          "tools": "Vercel"
        }
      ]
    }
  ],
  "CIVIL - Civil Engineering": [
    {
      "title": "Smart Traffic Flow Analyzer",
      "pitch": "Optimize traffic light timings based on simulated vehicle flow.",
      "outcome": "A fully working AI prototype you can link directly on your resume.",
      "blueprint": [
        {
          "time": "0-10 min",
          "step": "Environment Setup: Create a simple intersection simulation.",
          "tools": "VScode, Next.js"
        },
        {
          "time": "10-35 min",
          "step": "Core Logic: Input traffic volume data.",
          "tools": "Gemini API, Supabase"
        },
        {
          "time": "35-50 min",
          "step": "UI & Refinement: AI suggests optimal green light durations.",
          "tools": "Tailwind CSS"
        },
        {
          "time": "50-60 min",
          "step": "Demo & Deploy: Show expected reduction in wait times.",
          "tools": "Vercel"
        }
      ]
    },
    {
      "title": "Structural Defect Detector",
      "pitch": "Analyze images of buildings to find cracks and defects.",
      "outcome": "A fully working AI prototype you can link directly on your resume.",
      "blueprint": [
        {
          "time": "0-10 min",
          "step": "Environment Setup: Upload images of concrete/structures.",
          "tools": "VScode, Next.js"
        },
        {
          "time": "10-35 min",
          "step": "Core Logic: Use a computer vision API to identify cracks.",
          "tools": "Gemini API, Supabase"
        },
        {
          "time": "35-50 min",
          "step": "UI & Refinement: Highlight problem areas on the image.",
          "tools": "Tailwind CSS"
        },
        {
          "time": "50-60 min",
          "step": "Demo & Deploy: Generate a safety report.",
          "tools": "Vercel"
        }
      ]
    },
    {
      "title": "Construction Cost Estimator",
      "pitch": "AI predicts project costs based on material prices and labor.",
      "outcome": "A fully working AI prototype you can link directly on your resume.",
      "blueprint": [
        {
          "time": "0-10 min",
          "step": "Environment Setup: Input project dimensions and requirements.",
          "tools": "VScode, Next.js"
        },
        {
          "time": "10-35 min",
          "step": "Core Logic: Fetch current approximate material costs.",
          "tools": "Gemini API, Supabase"
        },
        {
          "time": "35-50 min",
          "step": "UI & Refinement: AI factors in labor and time estimates.",
          "tools": "Tailwind CSS"
        },
        {
          "time": "50-60 min",
          "step": "Demo & Deploy: Output a detailed budget breakdown.",
          "tools": "Vercel"
        }
      ]
    }
  ],
  "Other": [
    {
      "title": "AI Resume Screener",
      "pitch": "Match resumes to job descriptions instantly.",
      "outcome": "A fully working AI prototype you can link directly on your resume.",
      "blueprint": [
        {
          "time": "0-10 min",
          "step": "Environment Setup: Upload resume and job description.",
          "tools": "VScode, Next.js"
        },
        {
          "time": "10-35 min",
          "step": "Core Logic: AI extracts skills and experience.",
          "tools": "Gemini API, Supabase"
        },
        {
          "time": "35-50 min",
          "step": "UI & Refinement: Calculate a match percentage.",
          "tools": "Tailwind CSS"
        },
        {
          "time": "50-60 min",
          "step": "Demo & Deploy: Provide tips for improvement.",
          "tools": "Vercel"
        }
      ]
    },
    {
      "title": "Smart Study Notes",
      "pitch": "Convert long lectures into summary flashcards.",
      "outcome": "A fully working AI prototype you can link directly on your resume.",
      "blueprint": [
        {
          "time": "0-10 min",
          "step": "Environment Setup: Input lecture transcript.",
          "tools": "VScode, Next.js"
        },
        {
          "time": "10-35 min",
          "step": "Core Logic: AI summarizes key points.",
          "tools": "Gemini API, Supabase"
        },
        {
          "time": "35-50 min",
          "step": "UI & Refinement: Generate interactive flashcards.",
          "tools": "Tailwind CSS"
        },
        {
          "time": "50-60 min",
          "step": "Demo & Deploy: Export to PDF.",
          "tools": "Vercel"
        }
      ]
    },
    {
      "title": "Campus Q&A Bot",
      "pitch": "An AI chatbot for answering student queries about the campus.",
      "outcome": "A fully working AI prototype you can link directly on your resume.",
      "blueprint": [
        {
          "time": "0-10 min",
          "step": "Environment Setup: Upload a campus FAQ document.",
          "tools": "VScode, Next.js"
        },
        {
          "time": "10-35 min",
          "step": "Core Logic: Create a chat interface.",
          "tools": "Gemini API, Supabase"
        },
        {
          "time": "35-50 min",
          "step": "UI & Refinement: AI answers questions based only on the FAQ.",
          "tools": "Tailwind CSS"
        },
        {
          "time": "50-60 min",
          "step": "Demo & Deploy: Log unanswered questions for admins.",
          "tools": "Vercel"
        }
      ]
    }
  ]
};
