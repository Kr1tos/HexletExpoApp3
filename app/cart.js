import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("cart.db");

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = () => {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM cart", [], (_, { rows }) => {
        setCartItems(rows._array);
      });
    });
  };

  return (
    <FlatList
      data={cartItems}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>${item.price}</Text>
          <Text style={styles.quantity}>Количество: {item.quantity}</Text>
        </View>
      )}
    />
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
  price: {
    fontSize: 14,
    color: 'green',
  },
  quantity: {
    fontSize: 14,
    color: 'blue',
  },
});
