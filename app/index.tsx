import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";

const FAVORITOS_KEY = "@universidades_favoritas";

interface Universidade {
  name: string;
  country: string;
  alpha_two_code: string;
  "state-province": string | null;
  domains: string[];
  web_pages: string[];
}

interface Favorito {
  name: string;
  web_page: string;
}

export default function PrincipalScreen() {
  const [pais, setPais] = useState<string>("");
  const [universidade, setUniversidade] = useState<string>("");
  const [resultados, setResultados] = useState<Universidade[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pesquisaFeita, setPesquisaFeita] = useState<boolean>(false);

  const handlePesquisar = async () => {
    Keyboard.dismiss();
    if (!pais.trim() && !universidade.trim()) {
      Alert.alert(
        "Atenção",
        "Informe ao menos o País ou a Universidade para pesquisar."
      );
      return;
    }

    setIsLoading(true);
    setResultados([]);
    setPesquisaFeita(false);

    let url = "http://universities.hipolabs.com/search?";
    const params: string[] = [];
    if (pais.trim()) {
      params.push(`country=${encodeURIComponent(pais.trim())}`);
    }
    if (universidade.trim()) {
      params.push(`name=${encodeURIComponent(universidade.trim())}`);
    }
    url += params.join("&");

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro na rede: ${response.status}`);
      }
      const data: Universidade[] = await response.json();

      setResultados(data);
      setPesquisaFeita(true);

      if (data.length === 0) {
      }
    } catch (error: any) {
      const errorMessage =
        error.message ||
        "Não foi possível buscar as universidades. Verifique sua conexão ou a URL.";
      Alert.alert("Erro na Pesquisa", errorMessage);
      setResultados([]);
      setPesquisaFeita(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoritar = async (item: Universidade) => {
    if (!item.web_pages || item.web_pages.length === 0 || !item.web_pages[0]) {
      Alert.alert(
        "Favoritar Falhou",
        `"${item.name}" não possui uma página web válida para adicionar aos favoritos.`
      );
      return;
    }

    const novoFavorito: Favorito = {
      name: item.name,
      web_page: item.web_pages[0],
    };

    try {
      const favoritosAtuaisStr = await AsyncStorage.getItem(FAVORITOS_KEY);
      let favoritosAtuais: Favorito[] = favoritosAtuaisStr
        ? JSON.parse(favoritosAtuaisStr)
        : [];

      const jaExiste = favoritosAtuais.some(
        (fav) => fav.web_page === novoFavorito.web_page
      );

      if (jaExiste) {
        Alert.alert(
          "Item Existente",
          `"${novoFavorito.name}" já está nos seus favoritos.`
        );
        router.push("/favoritos");
        return;
      }

      favoritosAtuais.push(novoFavorito);
      await AsyncStorage.setItem(
        FAVORITOS_KEY,
        JSON.stringify(favoritosAtuais)
      );
      Alert.alert(
        "Favoritado!",
        `"${novoFavorito.name}" adicionado aos favoritos.`
      );
      router.push("/favoritos");
    } catch (error) {
      Alert.alert("Erro ao Salvar", "Não foi possível salvar o favorito.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome do País (Ex: Brazil)"
        value={pais}
        onChangeText={setPais}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Nome da Universidade (Ex: Paulista)"
        value={universidade}
        onChangeText={setUniversidade}
        autoCapitalize="words"
      />
      <View style={styles.botoesContainer}>
        <View style={styles.botaoWrapper}>
          <Button
            title="Pesquisar"
            onPress={handlePesquisar}
            disabled={isLoading}
            color="#007AFF"
          />
        </View>
        <View style={styles.botaoWrapper}>
          <Link href="/favoritos" asChild>
            <Button title="Favoritos" color="#007AFF" />
          </Link>
        </View>
      </View>

      {isLoading && (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      )}

      {!isLoading && !pesquisaFeita && (
        <Text style={styles.infoText}>
          Informe um país e/ou universidade para pesquisar.
        </Text>
      )}

      {!isLoading && pesquisaFeita && resultados.length === 0 && (
        <Text style={styles.infoText}>
          Nenhuma universidade encontrada para os critérios informados.
        </Text>
      )}

      {!isLoading && resultados.length > 0 && (
        <FlatList
          data={resultados}
          keyExtractor={(item, index) =>
            `${item.country}-${item.name}-${index}`
          }
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleFavoritar(item)}>
              <View style={styles.listItem}>
                <Text style={styles.listItemText}>{item.name}</Text>
                <Text style={styles.listItemSubText}>{item.country}</Text>
              </View>
            </TouchableOpacity>
          )}
          style={styles.list}
          ListFooterComponent={() => <View style={{ height: 20 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F8F8F8",
  },
  input: {
    height: 50,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    fontSize: 16,
  },
  botoesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  botaoWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  loader: {
    marginTop: 30,
  },
  list: {
    marginTop: 10,
  },
  listItem: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  listItemText: {
    fontSize: 17,
    fontWeight: "500",
    color: "#333",
  },
  listItemSubText: {
    fontSize: 14,
    color: "#666",
    marginTop: 3,
  },
  infoText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#888",
  },
});
