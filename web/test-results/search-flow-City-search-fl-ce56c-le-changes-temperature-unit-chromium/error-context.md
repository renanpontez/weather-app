# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Skip to main content" [ref=e5] [cursor=pointer]:
    - /url: "#main-content"
  - generic [ref=e6]:
    - banner [ref=e7]:
      - heading "WeatherApp" [level=1] [ref=e9]
      - generic [ref=e10]:
        - generic [ref=e12]:
          - generic [ref=e13]: Search for a city
          - generic [ref=e14]:
            - img [ref=e15]
            - combobox "Search for a city" [ref=e18]
        - button "Switch to Fahrenheit" [ref=e20] [cursor=pointer]:
          - generic [ref=e21]: °C
          - generic [ref=e22]: /
          - generic [ref=e23]: °F
    - main [ref=e24]:
      - alert [ref=e26]:
        - paragraph [ref=e27]: "Request failed: 500"
        - button "Try again" [ref=e28]
      - alert [ref=e30]:
        - paragraph [ref=e31]: Could not determine location. Showing default city.
      - generic [ref=e33]:
        - generic [ref=e34]: 🌍
        - paragraph [ref=e35]: Search for a city
        - paragraph [ref=e36]: or allow location access for local weather
```