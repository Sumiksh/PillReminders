# 💊PillReminder

PillReminder Pro is an intelligent, high-performance medication management dashboard that bridges the gap between technical clinical data and patient-friendly care. It integrates official NIH RxNav, openFDA, and Google Gemini AI to provide a seamless experience for medication management.

## 🌟 Key Features

### ➕ **Smart Medication Entry**
- **RxNorm Integration:** Search and validate medications against the National Library of Medicine's official database.
- **Timezone Enforcement:** Precision scheduling using `America/New_York` (ET) to eliminate midnight UTC synchronization issues.
- **RxCUI Mapping:** Automatically captures unique clinical identifiers for downstream safety checks.

### 📅 **Visual Treatment Calendar**
- **30-Day Adherence Grid:** A high-contrast visual interface to track past compliance and future doses.
- **Dynamic Status Tracking:** Real-time updates for "Taken," "Pending," and "Missed" medications.
- **Contextual Details:** One-click access to specific dosing instructions for any chosen date.

### 🛡️ **Safety & Identification Suite**
- **FDA Guidelines:** Fetches official precautions and warnings directly from the [api.fda.gov](https://api.fda.gov) product labeling service.
- **Visual Pill ID:** Generates 3D CSS digital pill representations based on physical attributes (Color, Shape, Imprint).
- **AI Insights:** Utilizes Gemini 1.5 Flash to summarize complex medical data into concise, 1-2 line "Patient Notes."

## 🛠️ **Technical Stack**

- **Framework:** [Next.js 15](https://nextjs.org/docs) (App Router)
- **AI Engine:** [Google Gemini API](https://developers.google.com/ai)
- **Data Sources:**
  - [RxNav REST API](https://www.nlm.nih.gov/research/umls/rxnorm/index.html)
  - [openFDA API](https://open.fda.gov/apis/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://github.com/lucide-icons/lucide)

## 🚀 **Getting Started**

### Prerequisites
- **Node.js** 18.17 or later
- A **Google AI Studio API Key** to access the Gemini AI functionality.

### Installation
1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/meditrack-pro.git
   cd meditrack-pro
