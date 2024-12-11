import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, ScrollView, Text, View, StyleSheet } from 'react-native';

// Определим размеры экрана для адаптации графика
const { width, height } = Dimensions.get('window');
const PressureChart = ({ data }) => {
  // Подготовим данные для графика
  
  const formattedData = {
    labels: data.map(item => item.date),  // Сохраняем метки по оси X
    datasets: [
      {
        data: data.map(item => item.value),  // Нижнее давление
        color: (opacity = 1) => `rgba(0,0, 10, ${opacity})`,  // Синий цвет для нижнего давления
        strokeWidth: 2,
        label: 'Анализ',  // Добавим метку для нижнего давления
        fillShadowGradient: '#FFF',
        fillShadowGradientOpacity: 0,
      },
    ]
  };

  return (
    <View style={styles.chartContainer}>      
        <LineChart
          data={formattedData}
          width={width}  // Ширина графика по ширине экрана
          height={height*0.19}
          chartConfig={{
            backgroundGradientFrom: "#FFF",
            /**
             * Defines the first color opacity in the linear gradient of a chart's background
             */
            backgroundGradientFromOpacity: 0,
            /**
             * Defines the second color in the linear gradient of a chart's background
             */
            backgroundGradientTo: "#FFF",
            /**
             * Defines the second color opacity in the linear gradient of a chart's background
             */
            backgroundGradientToOpacity: 0,
            /**
             * Defines the previous options to maintain backwards compatibility
             */
            fillShadowGradient: "#FFF",
            fillShadowGradientOpacity: 0,
            /**
             * Defines the first color in the linear gradient of the area under data
             */
            fillShadowGradientFrom: "#FFF",
            /**
             * Defines the first color opacity in the linear gradient of the area under data
             */
            fillShadowGradientFromOpacity: 0,
            /**
             * Defines the first color offset in the linear gradient of the area under data
             */
            fillShadowGradientFromOffset: 0,
            /**
             * Defines the second color in the linear gradient of the area under data
             */
            fillShadowGradientTo: "#FFF",
            /**
             * Defines the second color opacity in the linear gradient of the area under data
             */
            fillShadowGradientToOpacity: 0,
            /**
             * Defines the second color offset in the linear gradient of the area under data
             */
            fillShadowGradientToOffset: 0,
            decimalPlaces: 1, // Количество знаков после запятой
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Цвет линий графика
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Цвет текста
            propsForDots: {
              r: '3',
            },
            
          }}
          bezier
          style={{
            marginVertical: 8,
            width: width * 0.9,
            overflow: "hidden",
            paddingRight: 35
          }}
          
        />
      </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderRadius: 12,
    marginBottom: width * 0.035,
    width: width * 0.9,
  },
  chartTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: width * 0.04,
  },
});

export default PressureChart;
