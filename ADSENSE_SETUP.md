# Google AdSense Setup Guide

## ✅ Current Status

### Files Created:
- ✅ `ads.txt` - Authorizes Google AdSense to display ads
- ✅ `src/config/adsense.js` - Centralized AdSense configuration
- ✅ `src/components/ads/` - Ad components (HeaderBanner, SidebarBanner, FooterBanner)
- ✅ Google AdSense script added to `index.html`

### Current Configuration:
- **Publisher ID**: `ca-pub-8989918672180030`
- **ads.txt**: ✅ Created and accessible at `/ads.txt`
- **Ad Slots**: Currently using placeholder IDs (need to be replaced)

## 🔧 Next Steps to Complete Setup

### 1. Create Ad Units in Google AdSense Dashboard

1. Go to [Google AdSense Dashboard](https://www.google.com/adsense/)
2. Navigate to **Ads** → **By ad unit**
3. Create the following ad units:

#### Header Banner Ad Unit
- **Name**: RiderForge Header Banner
- **Size**: 728x90 (Leaderboard) or Auto
- **Type**: Display ads
- **Placement**: Top of pages

#### Sidebar Banner Ad Unit
- **Name**: RiderForge Sidebar Banner
- **Size**: 300x250 (Medium Rectangle) or Auto
- **Type**: Display ads
- **Placement**: Right sidebar

#### Footer Banner Ad Unit
- **Name**: RiderForge Footer Banner
- **Size**: 728x90 (Leaderboard) or Auto
- **Type**: Display ads
- **Placement**: Bottom of pages

### 2. Update Ad Slot IDs

After creating the ad units, replace the placeholder IDs in `src/config/adsense.js`:

```javascript
AD_SLOTS: {
  HEADER_BANNER: 'YOUR_ACTUAL_HEADER_AD_SLOT_ID',
  SIDEBAR_BANNER: 'YOUR_ACTUAL_SIDEBAR_AD_SLOT_ID',
  FOOTER_BANNER: 'YOUR_ACTUAL_FOOTER_AD_SLOT_ID',
}
```

### 3. Test the Implementation

1. **Local Testing**: 
   - Run `npm run dev`
   - Visit `http://localhost:5173`
   - Check browser console for AdSense errors

2. **Production Testing**:
   - Deploy to your domain
   - Verify `ads.txt` is accessible at `https://yourdomain.com/ads.txt`
   - Check Google AdSense dashboard for ad serving status

## 📊 Ad Placement Strategy

### Current Implementation:
- **HomePage**: Header banner (top of page)
- **MyRiders Dashboard**: Sidebar banner (right side, desktop only)
- **Pro Users**: No ads displayed (value proposition)

### Ad Behavior:
- ✅ **Non-intrusive**: Ads blend with site design
- ✅ **Responsive**: Adapt to different screen sizes
- ✅ **Pro-friendly**: Pro users see no ads
- ✅ **Performance**: Async loading, no impact on site speed

## 🔍 Verification Checklist

- [ ] `ads.txt` file accessible at `https://yourdomain.com/ads.txt`
- [ ] Google AdSense script loaded in `<head>`
- [ ] Ad units created in AdSense dashboard
- [ ] Ad slot IDs updated in configuration
- [ ] Ads displaying for free users
- [ ] No ads for Pro users
- [ ] No console errors
- [ ] AdSense dashboard shows "Authorized" status

## 🚨 Troubleshooting

### Common Issues:

1. **"Not Found" ads.txt status**:
   - Ensure `ads.txt` is in the root directory
   - Verify file is accessible via HTTPS
   - Check file permissions

2. **Ads not displaying**:
   - Verify ad slot IDs are correct
   - Check browser console for errors
   - Ensure AdSense account is approved

3. **Pro users seeing ads**:
   - Check `isPro` status in AuthContext
   - Verify ad components check Pro status

## 📈 Expected Results

Once fully configured:
- Free users will see relevant, non-intrusive ads
- Pro users will have an ad-free experience
- Revenue generation through AdSense
- Improved Pro subscription value proposition

## 🔗 Useful Links

- [Google AdSense Help](https://support.google.com/adsense/)
- [ads.txt Specification](https://iabtechlab.com/ads-txt/)
- [AdSense Policy Center](https://www.google.com/adsense/new/localized-policies)
