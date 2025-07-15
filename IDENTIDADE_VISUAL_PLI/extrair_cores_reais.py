#!/usr/bin/env python3
"""
Script para extrair as cores reais da identidade visual institucional SIGMA-PLI
"""

try:
    from PIL import Image
    import collections
    import os
    
    def rgb_to_hex(rgb):
        """Converte RGB para formato hexadecimal"""
        return "#{:02x}{:02x}{:02x}".format(rgb[0], rgb[1], rgb[2])
    
    def extrair_cores_dominantes(caminho_imagem, num_cores=20):
        """Extrai as cores mais dominantes da imagem"""
        print(f"Analisando imagem: {caminho_imagem}")
        
        # Abrir e redimensionar a imagem para análise mais rápida
        with Image.open(caminho_imagem) as img:
            # Converter para RGB se necessário
            img = img.convert('RGB')
            
            # Redimensionar para análise mais rápida
            img = img.resize((150, 150), Image.Resampling.LANCZOS)
            
            # Obter todos os pixels
            pixels = list(img.getdata())
            
            # Contar a frequência de cada cor
            contador_cores = collections.Counter(pixels)
            
            # Obter as cores mais comuns
            cores_dominantes = contador_cores.most_common(num_cores)
            
            print(f"\nCores mais dominantes encontradas:")
            cores_hex = []
            for i, (cor, frequencia) in enumerate(cores_dominantes, 1):
                hex_cor = rgb_to_hex(cor)
                print(f"{i:2d}. {hex_cor} (RGB: {cor}) - {frequencia} pixels")
                cores_hex.append(hex_cor)
            
            return cores_hex
    
    def analisar_cores_por_regiao(caminho_imagem):
        """Analisa cores por regiões da imagem para identificar padrões"""
        print(f"\nAnálise por regiões da imagem:")
        
        with Image.open(caminho_imagem) as img:
            img = img.convert('RGB')
            width, height = img.size
            
            # Dividir em 4 quadrantes
            regioes = {
                'superior_esquerdo': (0, 0, width//2, height//2),
                'superior_direito': (width//2, 0, width, height//2),
                'inferior_esquerdo': (0, height//2, width//2, height),
                'inferior_direito': (width//2, height//2, width, height)
            }
            
            for nome_regiao, bbox in regioes.items():
                regiao = img.crop(bbox)
                pixels = list(regiao.getdata())
                contador = collections.Counter(pixels)
                cor_dominante = contador.most_common(1)[0][0]
                hex_cor = rgb_to_hex(cor_dominante)
                print(f"  {nome_regiao}: {hex_cor} (RGB: {cor_dominante})")
    
    # Caminho da imagem
    caminho_imagem = "conteudo_identidade_visual_pli.jpg"
    
    if os.path.exists(caminho_imagem):
        print("EXTRAÇÃO DE CORES - IDENTIDADE VISUAL SIGMA-PLI")
        print("=" * 60)
        
        # Extrair cores dominantes
        cores_dominantes = extrair_cores_dominantes(caminho_imagem, 15)
        
        # Análise por regiões
        analisar_cores_por_regiao(caminho_imagem)
        
        # Identificar possíveis cores institucionais
        print(f"\nCORES IDENTIFICADAS PARA A IDENTIDADE VISUAL:")
        print("=" * 50)
        
        # Filtrar cores muito escuras ou muito claras que podem ser ruído
        cores_filtradas = []
        for cor in cores_dominantes:
            # Converter hex para RGB para análise
            hex_clean = cor.replace('#', '')
            r = int(hex_clean[0:2], 16)
            g = int(hex_clean[2:4], 16)
            b = int(hex_clean[4:6], 16)
            
            # Evitar cores muito escuras (próximas do preto) ou muito claras (próximas do branco)
            brightness = (r + g + b) / 3
            if 30 < brightness < 220:  # Faixa intermediária
                cores_filtradas.append(cor)
        
        print("Cores principais sugeridas:")
        for i, cor in enumerate(cores_filtradas[:8], 1):
            print(f"  Cor {i}: {cor}")
        
        # Salvar resultado em arquivo
        with open('cores_extraidas_reais.txt', 'w', encoding='utf-8') as f:
            f.write("CORES EXTRAÍDAS DA IDENTIDADE VISUAL SIGMA-PLI\n")
            f.write("=" * 50 + "\n\n")
            f.write("Cores dominantes encontradas:\n")
            for i, cor in enumerate(cores_dominantes, 1):
                f.write(f"{i:2d}. {cor}\n")
            f.write("\nCores filtradas (recomendadas):\n")
            for i, cor in enumerate(cores_filtradas[:8], 1):
                f.write(f"  Cor {i}: {cor}\n")
        
        print(f"\nResultado salvo em: cores_extraidas_reais.txt")
        
    else:
        print(f"Erro: Arquivo '{caminho_imagem}' não encontrado!")
        print("Certifique-se de que o arquivo esteja na mesma pasta que este script.")

except ImportError:
    print("Erro: Biblioteca PIL (Pillow) não está instalada.")
    print("Para instalar, execute: pip install Pillow")
except Exception as e:
    print(f"Erro durante a análise: {e}")
