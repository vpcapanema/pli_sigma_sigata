#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import struct

def extract_jpeg_data_advanced(filepath):
    """
    Extração avançada de dados de arquivo JPEG para identificar cores da identidade visual
    """
    
    with open(filepath, 'rb') as f:
        data = f.read()
    
    print(f"Arquivo: {filepath}")
    print(f"Tamanho: {len(data)} bytes")
    
    # Análise mais sofisticada dos dados JPEG
    # Vamos procurar por padrões que podem indicar cores institucionales
    
    # Cores que geralmente aparecem em identidades visuais institucionais
    institutional_colors = []
    
    # Analisar sequências de 3 bytes que podem representar RGB
    for i in range(1000, len(data) - 3, 100):  # Saltar de 100 em 100 para eficiência
        r, g, b = data[i], data[i+1], data[i+2]
        
        # Filtrar cores que fazem sentido para identidade visual
        # Evitar cores muito escuras ou muito claras (provavelmente não são cores da marca)
        if (20 <= r <= 240 and 20 <= g <= 240 and 20 <= b <= 240):
            color_hex = f"#{r:02x}{g:02x}{b:02x}"
            
            # Verificar se é uma cor "interessante" (não muito próxima do cinza)
            if abs(r - g) > 10 or abs(g - b) > 10 or abs(r - b) > 10:
                if color_hex not in institutional_colors:
                    institutional_colors.append(color_hex)
    
    # Analisar com diferentes offsets para capturar mais variações
    for offset in [0, 1, 2]:
        for i in range(2000 + offset, len(data) - 3, 150):
            r, g, b = data[i], data[i+1], data[i+2]
            
            if (30 <= r <= 220 and 30 <= g <= 220 and 30 <= b <= 220):
                color_hex = f"#{r:02x}{g:02x}{b:02x}"
                if color_hex not in institutional_colors:
                    institutional_colors.append(color_hex)
    
    # Identificar cores que podem ser da paleta institucional
    # Cores típicas de identidade visual: azuis, verdes, vermelhos, dourados, etc.
    likely_brand_colors = []
    
    for color in institutional_colors:
        r = int(color[1:3], 16)
        g = int(color[3:5], 16) 
        b = int(color[5:7], 16)
        
        # Verificar se pode ser uma cor de marca
        # Azuis institucionais
        if b > r + 20 and b > g + 20:
            likely_brand_colors.append((color, "Azul institucional"))
        # Verdes institucionais  
        elif g > r + 20 and g > b + 20:
            likely_brand_colors.append((color, "Verde institucional"))
        # Vermelhos/laranjas
        elif r > g + 20 and r > b + 20:
            likely_brand_colors.append((color, "Vermelho/Laranja"))
        # Dourados/amarelos
        elif r > 150 and g > 150 and b < 100:
            likely_brand_colors.append((color, "Dourado/Amarelo"))
        # Roxos/violetas
        elif r > 100 and b > 100 and g < r - 20:
            likely_brand_colors.append((color, "Roxo/Violeta"))
    
    # Salvar análise detalhada
    with open('cores_identidade_visual.txt', 'w', encoding='utf-8') as f:
        f.write("CORES DA IDENTIDADE VISUAL PLI - ANÁLISE DETALHADA\n")
        f.write("=" * 60 + "\n\n")
        
        f.write(f"Total de cores potenciais encontradas: {len(institutional_colors)}\n")
        f.write(f"Cores prováveis da marca: {len(likely_brand_colors)}\n\n")
        
        f.write("CORES MAIS PROVÁVEIS DA IDENTIDADE VISUAL:\n")
        f.write("-" * 50 + "\n")
        
        for i, (color, tipo) in enumerate(likely_brand_colors[:15]):
            r = int(color[1:3], 16)
            g = int(color[3:5], 16)
            b = int(color[5:7], 16)
            f.write(f"{i+1:2d}. {color} - RGB({r:3d}, {g:3d}, {b:3d}) - {tipo}\n")
        
        f.write(f"\n\nTODAS AS CORES POTENCIAIS (primeiras 50):\n")
        f.write("-" * 40 + "\n")
        
        for i, color in enumerate(institutional_colors[:50]):
            r = int(color[1:3], 16)
            g = int(color[3:5], 16)
            b = int(color[5:7], 16)
            f.write(f"{i+1:2d}. {color} - RGB({r:3d}, {g:3d}, {b:3d})\n")
    
    print(f"\nEncontradas {len(institutional_colors)} cores potenciais")
    print(f"Cores prováveis da marca: {len(likely_brand_colors)}")
    
    print("\nCORES MAIS PROVÁVEIS DA IDENTIDADE VISUAL:")
    for i, (color, tipo) in enumerate(likely_brand_colors[:10]):
        r = int(color[1:3], 16)
        g = int(color[3:5], 16)
        b = int(color[5:7], 16)
        print(f"{i+1:2d}. {color} - RGB({r:3d}, {g:3d}, {b:3d}) - {tipo}")
    
    print("\nAnálise detalhada salva em 'cores_identidade_visual.txt'")
    
    return likely_brand_colors

if __name__ == "__main__":
    cores_marca = extract_jpeg_data_advanced("conteudo_identidade_visual_pli.jpg")
