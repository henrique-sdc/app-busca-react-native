import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Button,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, router } from "expo-router";

const FAVORITOS_KEY = "@universidades_favoritas";

interface Favorito {
  name: string;
  web_page: string;
}

export default function FavoritosScreen() {
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const carregarFavoritos = useCallback(async () => {
    setIsLoading(true);
    try {
      const favoritosStr = await AsyncStorage.getItem(FAVORITOS_KEY);
      const favs = favoritosStr ? JSON.parse(favoritosStr) : [];
      setFavoritos(favs);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os favoritos salvos.");
      setFavoritos([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarFavoritos();
    }, [carregarFavoritos])
  );

  const handleRemoverFavorito = async (itemParaRemover: Favorito) => {
    try {
      const favoritosAtuaisStr = await AsyncStorage.getItem(FAVORITOS_KEY);
      let favoritosAtuais: Favorito[] = favoritosAtuaisStr
        ? JSON.parse(favoritosAtuaisStr)
        : [];

      const originalLength = favoritosAtuais.length;

      const favoritosFiltrados = favoritosAtuais.filter(
        (fav) => fav.web_page !== itemParaRemover.web_page
      );

      if (favoritosFiltrados.length < originalLength) {
        await AsyncStorage.setItem(
          FAVORITOS_KEY,
          JSON.stringify(favoritosFiltrados)
        );

        setFavoritos(favoritosFiltrados);

        Alert.alert(
          "Removido com Sucesso",
          `"${itemParaRemover.name}" foi removido dos favoritos.`
        );
      }
    } catch (error) {
      console.error("Erro ao tentar remover favorito:", error);
    }
  };

  const handleVoltar = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando favoritos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {favoritos.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>
              Nenhuma universidade favoritada ainda.
            </Text>
          </View>
        ) : (
          <FlatList
            data={favoritos}
            keyExtractor={(item) => item.web_page}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleRemoverFavorito(item)}>
                <View style={styles.listItem}>
                  <Text style={styles.listItemTextUrl}>{item.web_page}</Text>
                  <Text style={styles.listItemTextName}>({item.name})</Text>
                </View>
              </TouchableOpacity>
            )}
            ListFooterComponent={() => (
              <Text style={styles.footerText}>
                Clique em um item para remover.
              </Text>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}

        <View style={styles.voltarButtonContainer}>
          <Button
            title="Voltar para Pesquisa"
            onPress={handleVoltar}
            color="#007AFF"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  container: {
    flex: 1,
    padding: 15,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  listItem: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  listItemTextUrl: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007AFF",
    marginBottom: 4,
  },
  listItemTextName: {
    fontSize: 14,
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
  },
  footerText: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
    fontSize: 14,
    color: "#AAA",
  },
  voltarButtonContainer: {
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
