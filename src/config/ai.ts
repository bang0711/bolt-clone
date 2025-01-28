import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const codeGenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [],
});

export const generateAICode = model.startChat({
  generationConfig: codeGenerationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: 'Generate a Project in React. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, \nwithout any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from "lucide-react" and use it in JSX as <Heart className="" />.\nalso you can use date-fns for date format and react-chartjs-2 chart, graph library\n\nReturn the response in JSON format with the following schema:\n{\n  "projectTitle": "",\n  "explanation": "",\n  "files": {\n    "/App.js": {\n      "code": ""\n    },\n    ...\n  },\n  "generatedFiles": []\n}\n\nHere’s the reformatted and improved version of your prompt:\n\nGenerate a programming code structure for a React project using Vite. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, without any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from "lucide-react" and use it in JSX as <Heart className="" />.\n\nReturn the response in JSON format with the following schema:\n\njson\nCopy code\n{\n  "projectTitle": "",\n  "explanation": "",\n  "files": {\n    "/App.js": {\n      "code": ""\n    },\n    ...\n  },\n  "generatedFiles": []\n}\nEnsure the files field contains all created files, and the generatedFiles field lists all the filenames. Each file\'s code should be included in the code field, following this example:\nfiles:{\n  "/App.js": {\n    "code": "import React from \'react\';\\nimport \'./styles.css\';\\nexport default function App() {\\n  return (\\n    <div className=\'p-4 bg-gray-100 text-center\'>\\n      <h1 className=\'text-2xl font-bold text-blue-500\'>Hello, Tailwind CSS with Sandpack!</h1>\\n      <p className=\'mt-2 text-gray-700\'>This is a live code editor.</p>\\n    </div>\\n  );\\n}"\n  }\n}\n  Additionally, include an explanation of the project\'s structure, purpose, and functionality in the explanation field. Make the response concise and clear in one paragraph.\n  - When asked then only use this package to import, here are some packages available to import and use (date-fns,react-chartjs-2,"firebase","@google/generative-ai" ) only when it required\n  \n  - For placeholder images, please use a https://archive.org/download/placeholder-image/placeholder-image.jpg\n  -Add Emoji icons whenever needed to give good user experience\n  - all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\n- By default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\n- Use icons from lucide-react for logos.\n\n- Use stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.\n',
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "projectTitle": "Dashboard App",\n  "explanation": "This React project creates a simple dashboard application using Tailwind CSS for styling, lucide-react for icons, date-fns for date formatting, and react-chartjs-2 for charting. The application includes several components: a header with navigation, a sidebar with user info and links, a main content area showcasing several metrics and a sample chart, and a card component, each organized into separate directories with .js files. The purpose is to demonstrate a basic dashboard layout with some interactive elements, focusing on clean design and clear code structure. The goal is to create a visually appealing and fully featured application suitable for production, using stock photos, emoji icons, and thoughtful design.",\n  "files": {\n    "/App.js": {\n      "code": "import React from \'react\';\\nimport Header from \'./components/Header/Header\';\\nimport Sidebar from \'./components/Sidebar/Sidebar\';\\nimport MainContent from \'./components/MainContent/MainContent\';\\n\\nfunction App() {\\n  return (\\n    <div className=\\"flex h-screen bg-gray-100\\">\\n      <Sidebar />\\n      <div className=\\"flex-1 flex flex-col overflow-hidden\\">\\n        <Header />\\n        <MainContent />\\n      </div>\\n    </div>\\n  );\\n}\\n\\nexport default App;"\n    },\n    "/components/Header/Header.js": {\n      "code": "import React from \'react\';\\nimport { Menu, Search, Bell, User } from \'lucide-react\';\\n\\nfunction Header() {\\n  return (\\n    <header className=\\"bg-white shadow flex items-center justify-between p-4\\">\\n      <div className=\\"flex items-center\\">\\n          <button className=\\"mr-4 p-2 text-gray-700 focus:outline-none focus:ring focus:ring-gray-300 rounded-md \\"> <Menu/> </button>\\n        <h1 className=\\"text-xl font-semibold\\">Dashboard 📊</h1>\\n      </div>\\n      <div className=\\"flex items-center space-x-4\\">\\n          <div className=\\"relative text-gray-600\\">\\n              <input type=\\"search\\" name=\\"search\\" placeholder=\\"Search\\" className=\\"bg-gray-100 h-10 px-5 pr-10 rounded-full text-sm focus:outline-none focus:ring focus:ring-blue-300 border border-gray-200 \\"/>\\n              <button type=\\"submit\\" className=\\"absolute right-0 top-0 mt-3 mr-4\\"> <Search/> </button>\\n          </div>\\n\\n        <button className=\\"p-2 text-gray-700 focus:outline-none focus:ring focus:ring-gray-300 rounded-full\\"> <Bell/> </button>\\n        <button className=\\"p-2 text-gray-700 focus:outline-none focus:ring focus:ring-gray-300 rounded-full\\"> <User/> </button>\\n\\n      </div>\\n    </header>\\n  );\\n}\\n\\nexport default Header;"\n    },\n    "/components/Sidebar/Sidebar.js": {\n      "code": "import React from \'react\';\\nimport { Home, Users, Settings, Mail, Clock } from \'lucide-react\';\\n\\nfunction Sidebar() {\\n  return (\\n    <aside className=\\"w-64 bg-gray-200 p-4\\">\\n      <div className=\\"mb-8 text-center\\">\\n          <img src=\\"https://archive.org/download/placeholder-image/placeholder-image.jpg\\" alt=\\"User Avatar\\" className=\\"w-20 h-20 rounded-full mx-auto mb-2\\" />\\n          <h2 className=\\"text-lg font-semibold\\">John Doe</h2>\\n           <p className=\'text-sm text-gray-600\'>Manager </p>\\n      </div>\\n      <nav>\\n          <a href=\\"#\\" className=\\"block p-2 mb-2 text-gray-700 hover:bg-gray-300 hover:text-gray-900 rounded-md flex items-center\\"><Home className=\\"mr-2\\"/> Home</a>\\n        <a href=\\"#\\" className=\\"block p-2 mb-2 text-gray-700 hover:bg-gray-300 hover:text-gray-900 rounded-md flex items-center\\"><Users className=\\"mr-2\\"/> Users</a>\\n        <a href=\\"#\\" className=\\"block p-2 mb-2 text-gray-700 hover:bg-gray-300 hover:text-gray-900 rounded-md flex items-center\\"><Clock className=\\"mr-2\\"/> Activity</a>\\n        <a href=\\"#\\" className=\\"block p-2 mb-2 text-gray-700 hover:bg-gray-300 hover:text-gray-900 rounded-md flex items-center\\"><Mail className=\\"mr-2\\"/> Messages</a>\\n        <a href=\\"#\\" className=\\"block p-2 mb-2 text-gray-700 hover:bg-gray-300 hover:text-gray-900 rounded-md flex items-center\\"><Settings className=\\"mr-2\\"/> Settings</a>\\n      </nav>\\n    </aside>\\n  );\\n}\\n\\nexport default Sidebar;"\n    },\n        "/components/MainContent/MainContent.js": {\n      "code": "import React from \'react\';\\nimport MetricCard from \'../MetricCard/MetricCard\';\\nimport ChartComponent from \'../ChartComponent/ChartComponent\';\\n\\nfunction MainContent() {\\n  return (\\n    <main className=\\"flex-1 p-4 overflow-y-auto\\">\\n      <h2 className=\\"text-2xl font-semibold mb-6\\">Overview</h2>\\n      <div className=\\"grid grid-cols-1 md:grid-cols-3 gap-4 mb-6\\">\\n        <MetricCard title=\\"Total Users\\" value=\\"12,345\\" icon=\\"Users\\" change=\\"+12%\\" />\\n        <MetricCard title=\\"Active Users\\" value=\\"5,678\\" icon=\\"User\\" change=\\"-5%\\"  />\\n        <MetricCard title=\\"Daily Traffic\\" value=\\"2,456\\" icon=\\"ArrowRight\\" change=\\"+2%\\"/>\\n      </div>\\n\\n        <div className=\\"bg-white shadow rounded-md p-4\\">\\n            <h3 className=\'text-xl font-semibold mb-4\'>User Growth 📈</h3>\\n             <ChartComponent/>\\n        </div>\\n    </main>\\n  );\\n}\\n\\nexport default MainContent;"\n    },\n    "/components/MetricCard/MetricCard.js": {\n        "code": "import React from \'react\';\\nimport { Users, User, ArrowRight } from \'lucide-react\';\\n\\nconst iconMap = {\\n  Users: Users,\\n  User: User,\\n  ArrowRight: ArrowRight,\\n};\\n\\nfunction MetricCard({ title, value, icon, change }) {\\n     const IconComponent = iconMap[icon];\\n\\n  return (\\n    <div className=\\"bg-white shadow rounded-md p-4 flex items-center justify-between\\">\\n      <div>\\n        <h3 className=\\"text-lg font-semibold text-gray-700\\">{title}</h3>\\n        <p className=\\"text-2xl font-bold text-gray-900\\">{value}</p>\\n        <p className={`text-sm ${change.startsWith(\'+\') ? \'text-green-500\' : \'text-red-500\'} font-medium`}>\\n            {change}\\n        </p>\\n      </div>\\n        <div className=\'text-gray-500 bg-gray-100 p-2 rounded-full\'> <IconComponent size={30}/></div>\\n    </div>\\n  );\\n}\\n\\nexport default MetricCard;"\n      },\n      "/components/ChartComponent/ChartComponent.js":{\n        "code":"import React from \'react\';\\nimport { Bar } from \'react-chartjs-2\';\\nimport {Chart as ChartJS,CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend} from \'chart.js\';\\n\\nChartJS.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend);\\n\\nfunction ChartComponent() {\\n\\n    const data = {\\n        labels: [\'Jan\', \'Feb\', \'Mar\', \'Apr\', \'May\', \'Jun\'],\\n        datasets: [\\n          {\\n            label: \'Users\',  \\n            backgroundColor: \'#3b82f6\',\\n            borderColor: \'#3b82f6\',\\n            borderWidth: 1,\\n            hoverBackgroundColor: \'#60a5fa\',\\n            hoverBorderColor: \'#60a5fa\',\\n            data: [65, 59, 80, 81, 56, 70],\\n          },\\n          {\\n            label: \'New User\',  \\n            backgroundColor: \'#94a3b8\',\\n            borderColor: \'#94a3b8\',\\n            borderWidth: 1,\\n            hoverBackgroundColor: \'#cbd5e1\',\\n            hoverBorderColor: \'#cbd5e1\',\\n            data: [20, 35, 25, 45, 15, 30],\\n          }\\n        ],\\n      };\\n    \\n    const options = {\\n        responsive: true,\\n        plugins: {\\n            legend: {\\n              position: \'top\',\\n            },\\n             title: {\\n                 display: true,\\n                 text: \'Monthly Users Statistics\',\\n             },\\n           },\\n      }\\n\\n  return (\\n    <div className=\'w-full \'>\\n      <Bar data={data} options={options} />\\n    </div>\\n  );\\n}\\n\\nexport default ChartComponent;"\n      }\n  },\n  "generatedFiles": [\n    "/App.js",\n    "/components/Header/Header.js",\n    "/components/Sidebar/Sidebar.js",\n        "/components/MainContent/MainContent.js",\n        "/components/MetricCard/MetricCard.js",\n    "/components/ChartComponent/ChartComponent.js"\n  ]\n}\n```\n',
        },
      ],
    },
  ],
});
