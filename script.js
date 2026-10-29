document.addEventListener('DOMContentLoaded', () => {
  let signalTimer = null;
  let chartInstance = null;

  const generateButton = document.getElementById('generate-btn');
  const chartElement = document.getElementById('chart');
  const signalResult = document.getElementById('signal-result');
  const signalTime = document.getElementById('signal-time');

  initTheme();
  initCustomSelects();
  initButtonEffects();
  changeLanguage();

  generateButton.addEventListener('click', () => {
    generateButton.disabled = true;
    generateButton.textContent = 'Анализируем...';
    generateButton.classList.add('loading');

    if (signalTimer !== null) {
      clearTimeout(signalTimer);
    }

    if (chartInstance !== null) {
      chartInstance.destroy();
      chartInstance = null;
    }

    signalResult.innerHTML = `
      <div class="loading-animation">
        <div class="loadingDots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p>Алгоритм обрабатывает данные</p>
      </div>
    `;

    signalTimer = setTimeout(() => {
      generateButton.disabled = false;
      generateButton.textContent = translations.ru.generateButton;
      generateButton.classList.remove('loading');

      const currencyPair =
        document.getElementById('currency-pair').value;

      const timeframe = document
        .getElementById('timeframe')
        .value
        .replace(/[^0-9]/g, '');

      const isBuy = Math.random() > 0.5;
      const probability = (Math.random() * 10 + 85).toFixed(2);

      const currentTime = new Date().toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const language =
        document.getElementById('language').value || 'ru';

      const text = translations[language];

      signalResult.innerHTML = `
        <div class="signal-details">
          <div class="signal-pair">
            ${currencyPair}
          </div>

          <div class="signal-direction ${isBuy ? 'green' : 'red'}">
            ${isBuy ? text.buy : text.sell}
          </div>

          <div class="signal-time-info">
            <div class="signal-timeframe">
              ${text.timeframe}: ${timeframe} ${text.minute}
            </div>

            <div class="signal-probability">
              ${text.accuracy}: ${probability}%
            </div>
          </div>
        </div>
      `;

      signalTime.textContent = currentTime;

      chartInstance = renderEnhancedChart(
        chartElement,
        isBuy,
        parseInt(timeframe, 10) * 60 * 1000
      );
    }, 3000);
  });

  document
    .getElementById('language')
    .addEventListener('change', changeLanguage);
});


const translations = {
  ru: {
    logoText: 'TradeAi| Бот Аналитик',
    currencyLabel: 'Инструмент',
    timeframeLabel: 'Время',
    generateButton: 'Получить сигнал',
    signalTitle: 'Сигнал',
    signalPlaceholder: "Нажмите 'Получить сигнал'",
    chartTitle: 'Проанализированный график на валютную пару',
    languageLabel: 'Язык',
    timeframes: [
      '1 минута',
      '2 минуты',
      '3 минуты',
      '4 минуты',
      '5 минут'
    ],
    buy: 'Покупка',
    sell: 'Продажа',
    timeframe: 'Таймфрейм',
    accuracy: 'Точность',
    languageName: 'Русский',
    minute: 'мин.',
    telegramBtn: 'Перейти в Telegram'
  },

  en: {
    logoText: 'TradeAi| Analytics Bot',
    currencyLabel: 'Instrument',
    timeframeLabel: 'Time',
    generateButton: 'Get Signal',
    signalTitle: 'Signal',
    signalPlaceholder: "Click 'Get Signal'",
    chartTitle: 'Analyzed chart for a currency pair',
    languageLabel: 'Language',
    timeframes: [
      '1 minute',
      '2 minutes',
      '3 minutes',
      '4 minutes',
      '5 minutes'
    ],
    buy: 'Buy',
    sell: 'Sell',
    timeframe: 'Timeframe',
    accuracy: 'Accuracy',
    languageName: 'English',
    minute: 'min.',
    telegramBtn: 'Go to Telegram'
  },

  uz: {
    logoText: 'TradeAi| Tahlil Bot',
    currencyLabel: 'Asbob',
    timeframeLabel: 'Vaqt',
    generateButton: 'Signal Olish',
    signalTitle: 'Signal',
    signalPlaceholder: 'Signal Olish uchun bosing',
    chartTitle: 'Valyuta juftligi uchun tahlil qilingan diagramma',
    languageLabel: 'Til',
    timeframes: [
      '1 daqiqa',
      '2 daqiqa',
      '3 daqiqa',
      '4 daqiqa',
      '5 daqiqa'
    ],
    buy: 'Sotib olish',
    sell: 'Sotish',
    timeframe: "Vaqt oralig'i",
    accuracy: 'Aniqlik',
    languageName: "O'zbek",
    minute: 'daq.',
    telegramBtn: "Telegramga o'tish"
  }
};


function initButtonEffects() {
  const button = document.getElementById('generate-btn');

  if (!button) {
    return;
  }

  button.addEventListener('mousemove', event => {
    const rect = button.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    button.style.setProperty('--x', `${x}px`);
    button.style.setProperty('--y', `${y}px`);
  });
}


function initCustomSelects() {
  document.removeEventListener('click', closeAllSelects);

  const customSelects = document.querySelectorAll('.custom-select');

  customSelects.forEach(selectContainer => {
    const selectedElement =
      selectContainer.querySelector('.select-selected');

    const itemsContainer =
      selectContainer.querySelector('.select-items');

    const nativeSelect =
      selectContainer.querySelector('select');

    if (!selectedElement || !itemsContainer || !nativeSelect) {
      return;
    }

    const newSelectedElement = selectedElement.cloneNode(true);

    selectedElement.parentNode.replaceChild(
      newSelectedElement,
      selectedElement
    );

    newSelectedElement.addEventListener('click', event => {
      event.stopPropagation();

      closeAllSelects(selectContainer);

      itemsContainer.classList.toggle('select-hide');
      newSelectedElement.classList.toggle('select-arrow-active');

      if (!itemsContainer.classList.contains('select-hide')) {
        itemsContainer.style.animation = 'pulse-select 0.5s ease';

        setTimeout(() => {
          itemsContainer.style.animation = '';
        }, 500);
      }
    });

    const items =
      itemsContainer.querySelectorAll('.select-item');

    items.forEach(item => {
      const newItem = item.cloneNode(true);

      item.parentNode.replaceChild(newItem, item);

      newItem.addEventListener('click', () => {
        const value = newItem.getAttribute('data-value');

        if (
          newSelectedElement.getAttribute('data-select') ===
          'language'
        ) {
          const image = newItem.querySelector('img');

          newSelectedElement.innerHTML = `
            <img
              src="${image ? image.src : ''}"
              alt="${value.toUpperCase()}"
              class="flag-icon"
            >
            ${newItem.textContent.trim()}
          `;

          nativeSelect.value = value;
          changeLanguage();
        } else {
          newSelectedElement.textContent =
            newItem.textContent.trim();

          const options = nativeSelect.options;

          for (let i = 0; i < options.length; i++) {
            if (
              options[i].textContent ===
              newItem.textContent.trim()
            ) {
              nativeSelect.selectedIndex = i;
              break;
            }
          }
        }

        items.forEach(option => {
          option.classList.remove('selected');
        });

        newItem.classList.add('selected');
        itemsContainer.classList.add('select-hide');
        newSelectedElement.classList.remove('select-arrow-active');
        newSelectedElement.classList.add('select-changed');

        setTimeout(() => {
          newSelectedElement.classList.remove('select-changed');
        }, 500);

        nativeSelect.dispatchEvent(new Event('change'));
      });
    });
  });

  document.addEventListener('click', closeAllSelects);
}


function closeAllSelects(exception = null) {
  const items = document.querySelectorAll('.select-items');
  const selectedElements =
    document.querySelectorAll('.select-selected');

  items.forEach((item, index) => {
    if (
      exception &&
      item.parentElement === exception
    ) {
      return;
    }

    item.classList.add('select-hide');

    if (selectedElements[index]) {
      selectedElements[index].classList.remove(
        'select-arrow-active'
      );
    }
  });
}


function changeLanguage() {
  const languageElement =
    document.getElementById('language');

  if (!languageElement) {
    return;
  }

  const language = languageElement.value || 'ru';
  const text = translations[language];

  if (!text) {
    return;
  }

  const flagImages = {
    ru: 'https://flagcdn.com/w20/ru.png',
    en: 'https://flagcdn.com/w20/gb.png',
    uz: 'https://flagcdn.com/w20/uz.png'
  };

  setText('logo-text', text.logoText);
  setText('currency-label', text.currencyLabel);
  setText('timeframe-label', text.timeframeLabel);
  setText('generate-btn', text.generateButton);
  setText('signal-title', text.signalTitle);
  setText('chart-title', text.chartTitle);

  const languageLabel =
    document.getElementById('language-label');

  if (languageLabel) {
    languageLabel.textContent = text.languageLabel;
  }

  const telegramText =
    document.querySelector('.telegram-btn span');

  if (telegramText) {
    telegramText.textContent = text.telegramBtn;
  }

  const placeholder =
    document.querySelector('.signal-placeholder');

  if (placeholder) {
    placeholder.textContent = text.signalPlaceholder;
  }

  const languageSelected =
    document.querySelector('[data-select="language"]');

  if (languageSelected) {
    languageSelected.innerHTML = `
      <img
        src="${flagImages[language]}"
        alt="${language.toUpperCase()}"
        class="flag-icon"
      >
      ${text.languageName}
    `;
  }

  const timeframeItems =
    document.getElementById('timeframe-items');

  const timeframeSelected =
    document.querySelector('[data-select="timeframe"]');

  const timeframeSelect =
    document.getElementById('timeframe');

  if (timeframeItems && timeframeSelected && timeframeSelect) {
    timeframeItems.innerHTML = '';

    text.timeframes.forEach(timeframe => {
      const item = document.createElement('div');

      item.className = 'select-item';
      item.setAttribute('data-value', timeframe);
      item.textContent = timeframe;

      timeframeItems.appendChild(item);
    });

    timeframeSelected.textContent = text.timeframes[0];

    timeframeSelect.innerHTML = '';

    text.timeframes.forEach(timeframe => {
      const option = document.createElement('option');

      option.textContent = timeframe;
      option.value = timeframe;

      timeframeSelect.appendChild(option);
    });
  }

  const container = document.querySelector('.container');

  if (container) {
    container.classList.add('language-change');

    setTimeout(() => {
      container.classList.remove('language-change');
    }, 500);
  }

  initCustomSelects();
}


function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}


function renderEnhancedChart(chartElement, isBuy, duration) {
  chartElement.innerHTML = '';

  const width = chartElement.clientWidth;
  const height = chartElement.clientHeight;

  const margin = {
    top: 20,
    right: 10,
    bottom: 40,
    left: 40
  };

  const svg = d3
    .select(chartElement)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const chartGroup = svg
    .append('g')
    .attr(
      'transform',
      `translate(${margin.left}, ${margin.top})`
    );

  const data = [];
  let currentPrice = 100 + Math.random() * 20;
  const direction = isBuy ? 1 : -1;
  const trendStrength = (10 + Math.random() * 5) / 30;

  for (let i = 0; i < 30; i++) {
    const open = currentPrice;
    const noise = (Math.random() - 0.5) *
      (0.5 + Math.random() * 0.5);

    let close =
      open +
      direction * trendStrength +
      noise;

    if (Math.random() > 0.9) {
      close += (Math.random() - 0.5) * 2;
    }

    const spread = 0.5 + Math.random();

    const high =
      Math.max(open, close) +
      spread * Math.random();

    const low =
      Math.min(open, close) -
      spread * Math.random();

    data.push({
      time: i + 1,
      open,
      close,
      high,
      low
    });

    currentPrice = close;
  }

  const innerWidth =
    width - margin.left - margin.right;

  const innerHeight =
    height - margin.top - margin.bottom;

  const xScale = d3
    .scaleBand()
    .domain(data.map(item => item.time))
    .range([0, innerWidth])
    .padding(0.4);

  const yScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, item => item.low) - 2,
      d3.max(data, item => item.high) + 2
    ])
    .range([innerHeight, 0]);

  const xAxis = d3
    .axisBottom(xScale)
    .tickValues(
      data
        .map(item => item.time)
        .filter((value, index) => index % 5 === 0)
    );

  const yAxis = d3
    .axisLeft(yScale)
    .ticks(6);

  chartGroup
    .append('g')
    .attr(
      'transform',
      `translate(0, ${innerHeight})`
    )
    .call(xAxis)
    .attr('color', 'var(--text-primary)')
    .attr('opacity', 0.5);

  chartGroup
    .append('g')
    .call(yAxis)
    .attr('color', 'var(--text-primary)')
    .attr('opacity', 0.5);

  chartGroup
    .append('g')
    .attr('class', 'grid')
    .call(
      d3
        .axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickFormat('')
        .ticks(6)
    )
    .call(group => {
      group.select('.domain').remove();
    })
    .call(group => {
      group
        .selectAll('.tick line')
        .attr('stroke', 'var(--border-color)')
        .attr('stroke-opacity', 0.3)
        .attr('stroke-dasharray', '3,3');
    });

  chartGroup
    .append('g')
    .attr('class', 'grid')
    .attr(
      'transform',
      `translate(0, ${innerHeight})`
    )
    .call(
      d3
        .axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickFormat('')
        .tickValues(
          data
            .map(item => item.time)
            .filter((value, index) => index % 5 === 0)
        )
    )
    .call(group => {
      group.select('.domain').remove();
    })
    .call(group => {
      group
        .selectAll('.tick line')
        .attr('stroke', 'var(--border-color)')
        .attr('stroke-opacity', 0.3)
        .attr('stroke-dasharray', '3,3');
    });

  const candlesGroup = chartGroup
    .append('g')
    .attr('class', 'candles');

  const candleDelay = Math.max(
    20,
    duration / data.length
  );

  data.forEach((candle, index) => {
    const isUp = candle.close >= candle.open;
    const color = isUp ? 'var(--accent-green)' : 'var(--accent-red)';

    const candleGroup = candlesGroup
      .append('g')
      .attr(
        'transform',
        `translate(${
          xScale(candle.time) +
          xScale.bandwidth() / 2
        }, 0)`
      )
      .style('opacity', 0);

    candleGroup
      .append('line')
      .attr('class', 'wick')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', yScale(candle.high))
      .attr('y2', yScale(candle.low))
      .attr('stroke', color)
      .attr('stroke-width', 1.5);

    const bodyTop = Math.min(
      yScale(candle.open),
      yScale(candle.close)
    );

    const bodyHeight = Math.abs(
      yScale(candle.open) -
      yScale(candle.close)
    );

    const body = candleGroup
      .append('rect')
      .attr(
        'class',
        isUp ? 'up-body' : 'down-body'
      )
      .attr('x', -xScale.bandwidth() / 2)
      .attr('width', xScale.bandwidth())
      .attr('y', bodyTop)
      .attr('height', 0)
      .attr('rx', 2)
      .attr('fill', color)
      .attr('stroke', color)
      .attr('stroke-width', 1);

    setTimeout(() => {
      candleGroup
        .transition()
        .duration(300)
        .style('opacity', 1);

      body
        .transition()
        .duration(500)
        .attr('height', Math.max(bodyHeight, 1));
    }, index * candleDelay);
  });

  const line = d3
    .line()
    .x(item =>
      xScale(item.time) +
      xScale.bandwidth() / 2
    )
    .y(item =>
      yScale((item.high + item.low) / 2)
    )
    .curve(d3.curveCardinal);

  setTimeout(() => {
    const trendLine = chartGroup
      .append('path')
      .datum(data)
      .attr('class', 'trend-line')
      .attr('fill', 'none')
      .attr(
        'stroke',
        isBuy ? 'var(--accent-green)' : 'var(--accent-red)'
      )
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('d', line)
      .attr('opacity', 0);

    const totalLength =
      trendLine.node().getTotalLength();

    trendLine
      .attr(
        'stroke-dasharray',
        `${totalLength} ${totalLength}`
      )
      .attr('stroke-dashoffset', totalLength)
      .attr('opacity', 1)
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);
  }, data.length * candleDelay + 300);

  return {
    destroy() {
      chartElement.innerHTML = '';
    }
  };
}


function initTheme() {
  const themeButtons =
    document.querySelectorAll('.theme-btn');

  const savedTheme =
    localStorage.getItem('theme') || 'dark';

  document.documentElement.setAttribute(
    'data-theme',
    savedTheme
  );

  updateActiveThemeButton(savedTheme);

  themeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const theme =
        button.getAttribute('data-theme');

      document.body.classList.add('theme-transition');

      setTimeout(() => {
        document.documentElement.setAttribute(
          'data-theme',
          theme
        );

        localStorage.setItem('theme', theme);
        updateActiveThemeButton(theme);

        setTimeout(() => {
          document.body.classList.remove(
            'theme-transition'
          );
        }, 500);
      }, 50);
    });
  });
}


function updateActiveThemeButton(theme) {
  document
    .querySelectorAll('.theme-btn')
    .forEach(button => {
      button.classList.toggle(
        'active',
        button.getAttribute('data-theme') === theme
      );
    });
}
