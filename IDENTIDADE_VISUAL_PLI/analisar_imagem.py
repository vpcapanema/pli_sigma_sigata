#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import struct
import os

def analyze_jpeg_colors(filepath):
    """
    Análise básica de cores em arquivo JPEG
    """
    print(f"Analisando arquivo: {filepath}")
    
    if not os.path.exists(filepath):
        print("Arquivo não encontrado!")
        return
    
    with open(filepath, 'rb') as f:
        data = f.read()
    
    # Verificar se é um JPEG válido
    if data[:2] != b'\xff\xd8':
        print("Não é um arquivo JPEG válido!")
        return
    
    file_size = len(data)
    print(f"Tamanho do arquivo: {file_size} bytes")
    
    # Procurar por marcadores JPEG para tentar extrair informações
    pos = 0
    width = height = 0
    
    while pos < len(data) - 1:
        if data[pos] == 0xFF:
            marker = data[pos + 1]
            pos += 2
            
            # Marcador SOF0 (Start of Frame) - contém dimensões
            if marker == 0xC0:
                if pos + 6 < len(data):
                    length = struct.unpack('>H', data[pos:pos+2])[0]
                    if pos + length < len(data):
                        height = struct.unpack('>H', data[pos+3:pos+5])[0]
                        width = struct.unpack('>H', data[pos+5:pos+7])[0]
                        print(f"Dimensões encontradas: {width}x{height}")
                        break
        pos += 1
    
    # Análise de bytes para tentar identificar padrões de cor
    # JPEG usa compressão, então vamos procurar padrões nos dados
    
    # Contar frequência de bytes (aproximação grosseira)
    byte_freq = {}
    for byte in data[100:]:  # Pular cabeçalho
        if byte in byte_freq:
            byte_freq[byte] += 1
        else:
            byte_freq[byte] = 1
    
    # Bytes mais frequentes (pode indicar cores dominantes)
    most_common_bytes = sorted(byte_freq.items(), key=lambda x: x[1], reverse=True)[:20]
    
    print("\nBytes mais frequentes (podem indicar cores):")
    for byte_val, count in most_common_bytes:
        print(f"Byte {byte_val:02x} ({byte_val:3d}): {count:6d} vezes")
    
    # Tentar identificar sequências que podem ser cores RGB
    potential_colors = []
    for i in range(0, len(data) - 2, 3):
        if i > 1000 and i < len(data) - 1000:  # Evitar cabeçalho e fim
            r, g, b = data[i], data[i+1], data[i+2]
            # Filtrar valores que podem ser cores válidas
            if all(0 <= val <= 255 for val in [r, g, b]):
                color_hex = f"#{r:02x}{g:02x}{b:02x}"
                if color_hex not in potential_colors:
                    potential_colors.append(color_hex)
                if len(potential_colors) >= 50:  # Limitar para não sobrecarregar
                    break
    
    print(f"\nPotenciais cores encontradas ({len(potential_colors)}):")
    for i, color in enumerate(potential_colors[:20]):
        print(f"{i+1:2d}. {color}")
    
    # Salvar análise
    with open('analise_manual_cores.txt', 'w', encoding='utf-8') as f:
        f.write("ANÁLISE MANUAL DE CORES - IDENTIDADE VISUAL PLI\n")
        f.write("=" * 50 + "\n\n")
        f.write(f"Arquivo: {filepath}\n")
        f.write(f"Tamanho: {file_size} bytes\n")
        if width and height:
            f.write(f"Dimensões: {width}x{height}\n")
        f.write("\nBytes mais frequentes:\n")
        for byte_val, count in most_common_bytes:
            f.write(f"Byte {byte_val:02x}: {count} vezes\n")
        
        f.write(f"\nPotenciais cores (primeiras 20):\n")
        for i, color in enumerate(potential_colors[:20]):
            f.write(f"{i+1:2d}. {color}\n")
    
    print("\nAnálise salva em 'analise_manual_cores.txt'")

if __name__ == "__main__":
    analyze_jpeg_colors("conteudo_identidade_visual_pli.jpg")
