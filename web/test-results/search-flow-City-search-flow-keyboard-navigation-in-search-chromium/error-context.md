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
            - combobox "Search for a city" [expanded] [active] [ref=e18]: Bergen
          - alert [ref=e19]: Failed to search cities. Please try again.
        - button "Switch to Fahrenheit" [ref=e21] [cursor=pointer]:
          - generic [ref=e22]: °C
          - generic [ref=e23]: /
          - generic [ref=e24]: °F
    - main [ref=e25]:
      - alert [ref=e27]:
        - paragraph [ref=e28]: "Request failed: 500"
        - button "Try again" [ref=e29]
      - alert [ref=e31]:
        - paragraph [ref=e32]: Could not determine location. Showing default city.
      - generic [ref=e34]:
        - generic [ref=e35]: 🌍
        - paragraph [ref=e36]: Search for a city
        - paragraph [ref=e37]: or allow location access for local weather
```