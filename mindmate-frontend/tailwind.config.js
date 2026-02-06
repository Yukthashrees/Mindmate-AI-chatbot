/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Calming Greens & Blues for Patients
        'calm-bg': '#F0F7F4',      // Very pale mint (Background)
        'calm-primary': '#70A9A1', // Sage Green (Buttons/Active)
        'calm-text': '#4B5563',    // Soft Gray (Text - easier than black)
        'chat-user': '#CFFAFE',    // Light Cyan (User bubbles)
        'chat-bot': '#FFFFFF',     // White (Bot bubbles)
        
        // Clinical colors for Dashboard
        'risk-high': '#FECACA',    // Soft Red (High Alert)
        'risk-med': '#FDE68A',     // Soft Yellow
        'risk-low': '#A7F3D0',     // Soft Green
      },
      fontFamily: {
        sans: ['Quicksand', 'Nunito', 'sans-serif'], // Suggest installing Quicksand from Google Fonts
      }
    },
  },
  plugins: [],
}