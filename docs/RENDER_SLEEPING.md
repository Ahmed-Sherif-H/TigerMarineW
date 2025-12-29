# Render Free Tier - Sleeping Behavior

## ⚠️ Important: Render Free Tier Limitations

On Render's **free tier**, services automatically **sleep after 15 minutes of inactivity**.

## What This Means

### When Service is Sleeping:
- ❌ First request takes **30-60 seconds** to wake up
- ❌ Requests may timeout during wake-up
- ❌ All functionality is affected (API, images, uploads, forms)
- ❌ Users see errors or long loading times

### When Service is Awake:
- ✅ Normal response times
- ✅ Everything works as expected
- ✅ Stays awake for 15 minutes after last request

## Solutions

### Option 1: Keep-Alive Ping (Free)

Create a simple ping service to keep the backend awake:

**Frontend - Add to `src/services/api.js`:**
```javascript
// Ping backend every 10 minutes to keep it awake
if (import.meta.env.PROD) {
  setInterval(async () => {
    try {
      await api.healthCheck();
      console.log('[Keep-Alive] Pinged backend');
    } catch (error) {
      console.warn('[Keep-Alive] Ping failed:', error.message);
    }
  }, 10 * 60 * 1000); // Every 10 minutes
}
```

**Or use external service:**
- UptimeRobot (free) - Pings your backend every 5 minutes
- cron-job.org (free) - Schedule periodic pings
- EasyCron (free tier) - Automated pings

### Option 2: Upgrade Render Plan ($7/month)

**Starter Plan Benefits:**
- ✅ Service never sleeps
- ✅ Always available
- ✅ Better performance
- ✅ More resources

### Option 3: Accept the Delay

- First user after sleep waits 30-60 seconds
- Subsequent users get normal speed
- Free but poor user experience

## Testing if Service is Sleeping

1. **Wait 15+ minutes** without accessing the site
2. **Try to access** the backend:
   ```bash
   curl https://tigermarinewbackend.onrender.com/api/health
   ```
3. **Measure response time:**
   - < 2 seconds = Awake ✅
   - 30-60 seconds = Waking up ⏳
   - Timeout = Sleeping ❌

## Recommended Solution

**For production:** Use **UptimeRobot** (free) to ping your backend every 5 minutes:
1. Sign up at https://uptimerobot.com
2. Add new monitor
3. URL: `https://tigermarinewbackend.onrender.com/api/health`
4. Interval: 5 minutes
5. This keeps your backend awake 24/7

**For development:** Accept the delay or upgrade to Starter plan.

