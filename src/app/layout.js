
import "./globals.css";
import Navbar from "./shared/Navbar";
import Chatbot from "./shared/Chatbot";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var stored = localStorage.getItem('theme');
                  var initial = stored || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.setAttribute('data-theme', initial);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <Navbar />
        {children}
        <Chatbot />
      </body>
    </html>
  );
}
