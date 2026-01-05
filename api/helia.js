<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Helia’s Cosmic Greetings</title>

<meta name="fc:miniapp" content='{"version":"1","imageUrl":"https://alien-mini-app.vercel.app/alien.png","button":{"title":"Greetings Earthling","action":{"type":"launch_miniapp","name":"Helia’s Cosmic Greetings","url":"https://alien-mini-app.vercel.app","splashImageUrl":"https://alien-mini-app.vercel.app/alien.png","splashBackgroundColor":"#39FF14"}}}' />

<meta name="fc:frame" content='{"version":"1","imageUrl":"https://alien-mini-app.vercel.app/alien.png","button":{"title":"Greetings Earthling","action":{"type":"launch_frame","name":"Helia’s Cosmic Greetings","url":"https://alien-mini-app.vercel.app","splashImageUrl":"https://alien-mini-app.vercel.app/alien.png","splashBackgroundColor":"#39FF14"}}}' />

<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #020816;
    color: #f5f5ff;
    font-family: system-ui, sans-serif;
    height: 100vh;
    overflow: hidden;
  }

  .app {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px;
    text-align: center;
  }

  h1 {
    font-size: 1.6rem;
    margin-bottom: 6px;
  }

  .subtitle {
    font-size: 0.95rem;
    opacity: 0.85;
    margin-bottom: 14px;
  }

  img {
    width: 180px;
    max-width: 60%;
    margin-bottom: 12px;
  }

  /* Bottom fixed button */
  .bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 14px 16px 18px;
    background: linear-gradient(to top, #020816 60%, transparent);
  }

  button {
    width: 100%;
    max-width: 360px;
    margin: 0 auto;
    display: block;
    background: #27e0a3;
    color: #04101b;
    border: none;
    border-radius: 999px;
    padding: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
  }

  button:active {
    transform: scale(0.98);
  }

  /* Modal */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    display: none;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .overlay.show {
    display: flex;
  }

  .message-card {
    background: linear-gradient(180deg, #142044, #0d162f);
    border-radius: 18px;
    padding: 20px;
    border: 1px solid rgba(255,255,255,0.15);
    max-width: 360px;
    width: 100%;
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .message-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.7;
    margin-bottom: 10px;
  }

  .message-text {
    font-size: 1.05rem;
    line-height: 1.45;
    font-weight: 500;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .spinner {
    border: 4px solid rgba(255,255,255,0.2);
    border-top: 4px solid #27e0a3;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    animation: spin 1s linear infinite;
    margin-left: 10px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
</head>

<body>
  <div class="app">
    <h1 id="holiday-title">Cosmic Greetings from Helia</h1>
    <div class="subtitle">A daily interstellar transmission</div>
    <img src="alien.png" alt="Helia the Alien" />
  </div>

  <!-- Modal -->
  <div id="overlay" class="overlay" onclick="closeModal()">
    <div class="message-card" onclick="event.stopPropagation()">
      <div class="message-label">Today’s Transmission</div>
      <div id="message" class="message-text"></div>
    </div>
  </div>

  <!-- Bottom button -->
  <div class="bottom-bar">
    <button onclick="generate()">Receive Transmission</button>
  </div>

  <script type="module">
    import { sdk } from 'https://esm.sh/@farcaster/miniapp-sdk';

    function getHolidayOrWeekday() {
      const d = new Date();
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const weekday = d.toLocaleDateString("en-US", { weekday: "long" });

      if (month === 1 && day === 1) return "New Year";
      if (month === 2 && day === 14) return "Valentine's Day";
      if (month === 7 && day === 4) return "Independence Day";
      if (month === 10 && day === 31) return "Halloween";
      if (month === 12 && day === 25) return "Christmas";

      return weekday;
    }

    document.getElementById("holiday-title").textContent =
      "Happy " + getHolidayOrWeekday() + " from Helia";

    window.generate = async function () {
      const overlay = document.getElementById("overlay");
      const messageEl = document.getElementById("message");

      // Show loading spinner
      messageEl.innerHTML = 'Receiving Transmission... <div class="spinner"></div>';
      overlay.classList.add("show");

      try {
        const res = await fetch('/api/helia');
        if (!res.ok) throw new Error('Failed to fetch transmission');
        const data = await res.json();
        messageEl.textContent = data.message;
      } catch (err) {
        messageEl.textContent = "Helia is recharging. Try again soon.";
        console.error(err);
      }
    };

    window.closeModal = function () {
      document.getElementById("overlay").classList.remove("show");
    };

    sdk.actions.ready();
  </script>
</body>
</html>
