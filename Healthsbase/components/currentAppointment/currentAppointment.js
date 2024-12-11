import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { useClientData } from '../../ClientDataContext';
import { useNavigation } from '@react-navigation/native';
import NavigationPanel from '../navigationPanel/navigationPanel';


const { width, height } = Dimensions.get('window');

const CurrentAppointment = ({ route }) => {
    const [data, setData] = useState([]);
    const { id } = route.params;
    const { state } = useClientData();
    const [clientData, setClientData] = useState(state.clientData);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const navigation = useNavigation();

    const handlePhotoChange = (date) => {
        setSelectedPhoto(date);
        setIsModalVisible(false); // Закрываем модальное окно после выбора
      };
    useEffect(() => {
        // Проверяем, что appointments существует и является массивом
        setClientData(state.clientData);
        const filteredData = clientData.appointments.find(item => item.id === id);

        if (filteredData ) {
            // Если есть совпадения, обновляем состояние с описаниями
            setData(filteredData); // Берем только первый элемент из отфильтрованных
            setSelectedPhoto(filteredData.photo);
        }
    }, [id, state.clientData]);
    
    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>Приём</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Appointments')}>
                        <Image source={require('./src/HomeOutline.svg')} style={styles.imageMenuAccount} />
                    </TouchableOpacity>
                </View>
                {data ? (
                <>
                    <Text style={styles.text}>Врач</Text>
                    <Text style={styles.fieldName}>{data.doctorType}</Text>
                    <Text style={styles.text}>Дата приёма</Text>
                    <Text style={styles.fieldName}>{data.appointmentData}</Text>
                    <Text style={styles.text}>Клиника</Text>
                    <Text style={styles.fieldName}>{data.clinic}</Text>
                    <Text style={styles.text}>ФИО врача</Text>
                    <Text style={styles.fieldName}>{data.doctorFio}</Text>
                    <Text style={styles.text}>Диагноз</Text>
                    <Text style={styles.fieldName}>{data.diagnosis}</Text>
                    <Text style={styles.text}>Назначение врача</Text>
                    <Text style={styles.fieldName}>{data.doctorComment}</Text>
                    <TouchableOpacity 
                        style={styles.fileButton} 
                        onPress={() => setIsModalVisible(true)}>
                        <Text style={styles.fileButtonText}>Прикрепленный документ</Text>
                        <Image 
                            source={require('./src/document-svgrepo-com.svg')} // Путь к иконке
                            style={styles.icon}
                        />
                    </TouchableOpacity>

                    <Modal
                        visible={isModalVisible}
                        animationType="fade"
                        transparent={true}
                        onRequestClose={() => setIsModalVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                            <Text style={styles.modalHeader}>Просмотр фото</Text>
                            <Image
                                source={{ uri: data.photo }} // Укажите путь к вашему фото
                                style={styles.modalImage}
                                resizeMode="contain"
                            />
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>Закрыть</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </>
                ) : (
                    <Text>Нет данных для отображения</Text>
                )}
            </View>
        <View style={styles.menu}>
            <NavigationPanel activeTab="Appointments"/>
        </View>
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: width * 0.05,
        backgroundColor: '#fbfbfb',
    },
    header: {
        fontSize: width * 0.088,
        fontWeight: 'bold',
        color: '#000',
    },
     headerContainer: {
        flexDirection: 'row', // Размещение элементов в строку
        justifyContent: 'space-between', // Заголовок слева, кнопка справа
        alignItems: 'center', // Выравнивание по центру вертикали
        marginBottom: height * 0.012,
    },
    text: {
        fontSize: width * 0.044,
        marginBottom: height * 0.012,
    },
    fieldName: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 16, // Увеличиваем горизонтальные отступы
        paddingVertical: 8,    // Добавляем вертикальные отступы
        textAlignVertical: 'top', // Расположение текста сверху для многострочного поля
        marginBottom: height * 0.012,
        fontSize: width * 0.044,
    },
    
    fileButton: {
        flexDirection: 'row', // Располагаем иконку и текст в одну строку
        alignItems: 'center', // Выравниваем по вертикали
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        marginBottom: height * 0.02,
        shadowColor: '#000', // Тень для кнопки
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Тень для Android
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 8, // Отступ между иконкой и текстом
        resizeMode: 'contain',
    },
    fileButtonText: {
        fontSize: width * 0.044,
        fontWeight: '500',
        color: '#333',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: width * 0.041,
        alignItems: 'center',
    },
    modalHeader: {
        fontSize: width * 0.046,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    modalImage: {
        width: '100%',
        height: width * 1.1, // Размер изображения
        borderRadius: 8,
        marginBottom: 12,
    },
    closeButton: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: width * 0.046,
        fontWeight: '500',
    },
});

export default CurrentAppointment;
