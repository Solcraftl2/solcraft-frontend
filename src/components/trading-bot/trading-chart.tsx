import { useEffect, useRef, useState } from 'react';
import { createChart, CrosshairMode, LineStyle } from 'lightweight-charts';
import { useIsDarkMode } from '@/lib/hooks/use-is-dark-mode';

export default function TradingChart(props: any) {
  const { isDarkMode } = useIsDarkMode();

  const [tooltipPosition, setTooltipPosition] = useState({
    display: 'none',
    left: 0,
    top: 0,
  });
  const { data, volumeData } = props;
  const chartContainerRef = useRef<HTMLDivElement>(null);
  let container = chartContainerRef?.current;

  useEffect(() => {
    // const handleResize = () => {
    //   chart.resize(window.innerWidth, window.innerHeight);
    //   chart.applyOptions({
    //     width: container?.clientWidth,
    //     height: container?.clientHeight,
    //   });
    // };

    // currency formatter
    const currentLocale = window.navigator.languages[0] || 'en-US';
    const myPriceFormatter = new Intl.NumberFormat(currentLocale, {
      style: 'currency',
      currency: 'USD',
    }).format;

    // create trading chart
    const chart = createChart(container!, {
      width: container?.clientWidth || 600,
      height: container?.clientHeight || 400,
      layout: {
        background: {
          type: 'solid',
          color: isDarkMode ? '#1f2937' : '#ffffff',
        },
        textColor: isDarkMode ? '#d1d5db' : '#374151',
      },
      grid: {
        vertLines: {
          color: isDarkMode ? '#374151' : '#e5e7eb',
        },
        horzLines: {
          color: isDarkMode ? '#374151' : '#e5e7eb',
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
      },
      timeScale: {
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
      },
      localization: {
        priceFormatter: myPriceFormatter,
      },
    });

    // add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#10b981',
      wickDownColor: '#ef4444',
      wickUpColor: '#10b981',
    });

    // add volume series
    const volumeSeries = chart.addHistogramSeries({
      color: '#6366f1',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    // set data
    if (data && data.length > 0) {
      candlestickSeries.setData(data);
    }

    if (volumeData && volumeData.length > 0) {
      volumeSeries.setData(volumeData);
    }

    // handle crosshair move
    chart.subscribeCrosshairMove((param) => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > (container?.clientWidth || 0) ||
        param.point.y < 0 ||
        param.point.y > (container?.clientHeight || 0)
      ) {
        setTooltipPosition({ display: 'none', left: 0, top: 0 });
      } else {
        const price = param.seriesPrices.get(candlestickSeries);
        if (price) {
          setTooltipPosition({
            display: 'block',
            left: param.point.x,
            top: param.point.y,
          });
        }
      }
    });

    // cleanup
    return () => {
      chart.remove();
    };
  }, [data, volumeData, isDarkMode, container]);

  return (
    <div className="relative h-96 w-full">
      <div ref={chartContainerRef} className="h-full w-full" />
      <div
        style={{
          position: 'absolute',
          display: tooltipPosition.display,
          left: tooltipPosition.left,
          top: tooltipPosition.top,
          pointerEvents: 'none',
          padding: '8px',
          background: isDarkMode ? '#374151' : '#ffffff',
          border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
          borderRadius: '4px',
          fontSize: '12px',
          color: isDarkMode ? '#d1d5db' : '#374151',
          zIndex: 1000,
        }}
      >
        Trading data tooltip
      </div>
    </div>
  );
}
