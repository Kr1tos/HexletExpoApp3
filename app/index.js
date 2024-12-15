import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, Button, Image, StyleSheet, RefreshControl } from 'react-native';
import { Link } from 'expo-router';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("cart.db");

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProducts();
    db.transaction(tx => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS cart (id INTEGER PRIMARY KEY NOT NULL, title TEXT, price REAL, image TEXT, quantity INTEGER);"
      );
    });
  }, []);

  const fetchProducts = () => {
    const staticProducts = [
      {
        id: 1,
        title: "Apple iPhone 13",
        description: "Смартфон с потрясающей камерой и отличной производительностью.",
        price: 999.99,
        image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-select-2021?wid=940&hei=1112&fmt=jpeg&qlt=90&.v=1631831647000",
      },
      {
        id: 2,
        title: "Samsung Galaxy S23",
        description: "Флагманский Android-смартфон с новейшими функциями.",
        price: 849.99,
        image: "https://images.samsung.com/is/image/samsung/p6pim/levant/galaxy-s23/gallery/levant-galaxy-s23-s911-sm-s911bzkeegt-thumb-533648847",
      },
      {
        id: 3,
        title: "Sony WH-1000XM5",
        description: "Наушники с активным шумоподавлением и высоким качеством звука.",
        price: 349.99,
        image: "https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg",
      },
      {
        id: 4,
        title: "MacBook Air M2",
        description: "Ультратонкий ноутбук с мощным процессором Apple M2.",
        price: 1249.99,
        image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mb-air-midnight-select-202206?wid=840&hei=1060&fmt=jpeg&qlt=90&.v=1653493200207",
      },
      {
        id: 5,
        title: "GoPro Hero 11",
        description: "Экшн-камера для съемки в экстремальных условиях.",
        price: 499.99,
        image: "https://m.media-amazon.com/images/I/71iqsOHOj6L._AC_SL1500_.jpg",
      },
      {
        id: 6,
        title: "Dyson V15 Detect",
        description: "Беспроводной пылесос с мощной системой фильтрации.",
        price: 749.99,
        image: "https://m.media-amazon.com/images/I/71EsqJafFeL._AC_SL1500_.jpg",
      },
      {
        id: 7,
        title: "Apple Watch Series 8",
        description: "Умные часы с функцией измерения здоровья.",
        price: 399.99,
        image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MQDW3_VW_34FR+watch-45-alum-midnight-cell-8s_VW_34FR_WF_CO?wid=940&hei=1112&fmt=png-alpha&.v=1661294143188",
      },
      {
        id: 8,
        title: "Kindle Paperwhite",
        description: "Электронная книга с подсветкой экрана и длительным зарядом.",
        price: 129.99,
        image: "https://m.media-amazon.com/images/I/61E3+g0HyNL._AC_SL1000_.jpg",
      },
      {
        id: 9,
        title: "Logitech MX Master 3",
        description: "Эргономичная беспроводная мышь для профессионалов.",
        price: 99.99,
        image: "https://m.media-amazon.com/images/I/71qJ1HnVA9L._AC_SL1500_.jpg",
      },
      {
        id: 10,
        title: "Razer BlackWidow V3",
        description: "Механическая клавиатура с RGB-подсветкой для геймеров.",
        price: 149.99,
        image: "https://m.media-amazon.com/images/I/71fRBcskFSL._AC_SL1500_.jpg",
      },
      {
        id: 11,
        title: "Bose SoundLink Revolve+",
        description: "Портативная колонка с объемным звуком.",
        price: 299.99,
        image: "https://m.media-amazon.com/images/I/61TV2A6POLL._AC_SL1500_.jpg",
      },
      {
        id: 12,
        title: "PlayStation 5",
        description: "Консоль нового поколения для захватывающего гейминга.",
        price: 499.99,
        image: "https://m.media-amazon.com/images/I/51QKhnv0bnL._AC_SL1000_.jpg",
      },
      {
        id: 13,
        title: "Microsoft Xbox Series X",
        description: "Игровая консоль с поддержкой 4K и производительной графикой.",
        price: 499.99,
        image: "https://m.media-amazon.com/images/I/71NBQ2a52CL._SL1500_.jpg",
      },
      {
        id: 14,
        title: "DJI Mini 3 Pro",
        description: "Компактный дрон для аэрофотосъемки.",
        price: 759.99,
        image: "https://m.media-amazon.com/images/I/71COYik8kEL._AC_SL1500_.jpg",
      },
      {
        id: 15,
        title: "Apple iPad Pro 11\"",
        description: "Планшет с поддержкой Apple Pencil и M2 процессором.",
        price: 999.99,
        image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-pro-11-select-202212?wid=940&hei=1112&fmt=jpeg&qlt=90&.v=1671304670767",
      },
      {
        id: 16,
        title: "Samsung QLED TV 65\"",
        description: "Телевизор с яркими цветами и функцией Smart TV.",
        price: 1499.99,
        image: "https://m.media-amazon.com/images/I/61PPRCe-TeL._AC_SL1000_.jpg",
      },
      {
        id: 17,
        title: "Fitbit Versa 4",
        description: "Умные часы для отслеживания активности и сна.",
        price: 229.99,
        image: "https://m.media-amazon.com/images/I/71vvXGmdKWL._AC_SL1500_.jpg",
      },
      {
        id: 18,
        title: "Sony PlayStation VR2",
        description: "Очки виртуальной реальности для PlayStation 5.",
        price: 549.99,
        image: "https://m.media-amazon.com/images/I/71VG5sTgGDL._AC_SL1500_.jpg",
      },
      {
        id: 19,
        title: "Canon EOS R6",
        description: "Беззеркальная камера для профессиональных фотографов.",
        price: 2499.99,
        image: "https://m.media-amazon.com/images/I/61G9z5otZCL._AC_SL1500_.jpg",
      },
      {
        id: 20,
        title: "Asus ROG Zephyrus G14",
        description: "Мощный игровой ноутбук с компактным дизайном.",
        price: 1649.99,
        image: "https://m.media-amazon.com/images/I/71CHKP4dyzL._AC_SL1500_.jpg",
      },
    ];
  
    setProducts(staticProducts);
    setRefreshing(false);
  };
  
  const addToCart = (item) => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM cart WHERE id = ?",
        [item.id],
        (_, { rows }) => {
          if (rows.length > 0) {
            tx.executeSql(
              "UPDATE cart SET quantity = quantity + 1 WHERE id = ?",
              [item.id]
            );
          } else {
            tx.executeSql(
              "INSERT INTO cart (id, title, price, image, quantity) VALUES (?, ?, ?, ?, ?)",
              [item.id, item.title, item.price, item.image, 1]
            );
          }
        }
      );
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            fetchProducts();
          }} />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.price}>${item.price}</Text>
            <Button title="Добавить в корзину" onPress={() => addToCart(item)} />
          </View>
        )}
      />
      <Link href="/cart">
        <View style={styles.cartButton}>
          <Text style={styles.cartButtonText}>Перейти в корзину</Text>
        </View>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  image: {
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 12,
    color: 'gray',
  },
  price: {
    fontSize: 14,
    color: 'green',
  },
  cartButton: {
    backgroundColor: '#000',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
