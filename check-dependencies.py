#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SIGMA PLI - Verificador de Dependências
Sistema de Gestão e Análise de Atas PLI-SP

Este script verifica se todas as dependências necessárias estão
instaladas e funcionando corretamente.
"""

import sys
import subprocess
import importlib
import json
from pathlib import Path
from typing import Dict, List, Tuple, Optional

class DependencyChecker:
    def __init__(self):
        self.results = {
            'system': {},
            'python': {},
            'nodejs': {},
            'database': {},
            'optional': {}
        }
        self.errors = []
        self.warnings = []
    
    def check_command(self, command: str) -> Tuple[bool, str]:
        """Verifica se um comando está disponível no sistema."""
        try:
            result = subprocess.run(
                [command, '--version'], 
                capture_output=True, 
                text=True, 
                timeout=10
            )
            if result.returncode == 0:
                return True, result.stdout.strip()
            return False, result.stderr.strip()
        except (subprocess.TimeoutExpired, FileNotFoundError):
            return False, f"Comando '{command}' não encontrado"
    
    def check_python_package(self, package: str, min_version: str = None) -> Tuple[bool, str]:
        """Verifica se um pacote Python está instalado."""
        try:
            module = importlib.import_module(package)
            version = getattr(module, '__version__', 'unknown')
            
            if min_version and version != 'unknown':
                from packaging import version as pkg_version
                if pkg_version.parse(version) < pkg_version.parse(min_version):
                    return False, f"Versão {version} < {min_version}"
            
            return True, version
        except ImportError:
            return False, "Não instalado"
        except Exception as e:
            return False, str(e)
    
    def check_nodejs_package(self, package: str) -> Tuple[bool, str]:
        """Verifica se um pacote Node.js está instalado."""
        try:
            package_json_path = Path('node_modules') / package / 'package.json'
            if package_json_path.exists():
                with open(package_json_path, 'r') as f:
                    data = json.load(f)
                    return True, data.get('version', 'unknown')
            return False, "Não encontrado em node_modules"
        except Exception as e:
            return False, str(e)
    
    def check_system_dependencies(self):
        """Verifica dependências do sistema."""
        print("🔍 Verificando dependências do sistema...")
        
        system_deps = {
            'Git': 'git',
            'Node.js': 'node',
            'npm': 'npm',
            'Python': 'python3',
            'pip': 'pip3',
            'PostgreSQL Client': 'psql'
        }
        
        for name, command in system_deps.items():
            is_available, info = self.check_command(command)
            self.results['system'][name] = {
                'available': is_available,
                'info': info,
                'required': True
            }
            
            if is_available:
                print(f"  ✅ {name}: {info.split()[0] if info else 'OK'}")
            else:
                print(f"  ❌ {name}: {info}")
                self.errors.append(f"{name} não encontrado")
        
        # Verificar Docker (opcional)
        is_available, info = self.check_command('docker')
        self.results['optional']['Docker'] = {
            'available': is_available,
            'info': info,
            'required': False
        }
        
        if is_available:
            print(f"  ✅ Docker (opcional): {info.split()[0] if info else 'OK'}")
        else:
            print(f"  ⚠️  Docker (opcional): Não encontrado")
            self.warnings.append("Docker não está instalado (opcional)")
    
    def check_python_dependencies(self):
        """Verifica dependências Python."""
        print("\n🐍 Verificando dependências Python...")
        
        # Verificar se está em ambiente virtual
        in_venv = sys.prefix != sys.base_prefix
        print(f"  {'✅' if in_venv else '⚠️ '} Ambiente virtual: {'Ativo' if in_venv else 'Não detectado'}")
        
        if not in_venv:
            self.warnings.append("Recomendado usar ambiente virtual Python")
        
        # Dependências principais
        python_deps = {
            'requests': '2.25.0',
            'pandas': '1.3.0',
            'numpy': '1.21.0',
            'scikit-learn': '1.0.0',
            'spacy': '3.4.0',
            'transformers': '4.20.0',
            'torch': '1.12.0',
            'nltk': '3.7.0',
            'psycopg2': '2.8.0',
            'python-dotenv': '0.19.0',
            'fastapi': '0.75.0',
            'pydantic': '1.9.0'
        }
        
        for package, min_version in python_deps.items():
            is_available, info = self.check_python_package(package, min_version)
            self.results['python'][package] = {
                'available': is_available,
                'version': info,
                'required': True
            }
            
            if is_available:
                print(f"  ✅ {package}: {info}")
            else:
                print(f"  ❌ {package}: {info}")
                self.errors.append(f"Pacote Python '{package}' não encontrado")
        
        # Verificar modelos spaCy
        try:
            import spacy
            nlp = spacy.load('pt_core_news_sm')
            print("  ✅ spaCy modelo português: pt_core_news_sm")
            self.results['python']['spacy_model'] = {
                'available': True,
                'version': 'pt_core_news_sm',
                'required': True
            }
        except Exception as e:
            print(f"  ❌ spaCy modelo português: {str(e)}")
            self.errors.append("Modelo spaCy português não encontrado")
            self.results['python']['spacy_model'] = {
                'available': False,
                'version': str(e),
                'required': True
            }
        
        # Verificar dados NLTK
        try:
            import nltk
            nltk.data.find('tokenizers/punkt')
            nltk.data.find('corpora/stopwords')
            print("  ✅ Dados NLTK: Baixados")
            self.results['python']['nltk_data'] = {
                'available': True,
                'version': 'Downloaded',
                'required': True
            }
        except Exception as e:
            print(f"  ❌ Dados NLTK: {str(e)}")
            self.warnings.append("Alguns dados NLTK podem estar faltando")
            self.results['python']['nltk_data'] = {
                'available': False,
                'version': str(e),
                'required': True
            }
    
    def check_nodejs_dependencies(self):
        """Verifica dependências Node.js."""
        print("\n📦 Verificando dependências Node.js...")
        
        # Verificar se node_modules existe
        if not Path('node_modules').exists():
            print("  ❌ Pasta node_modules não encontrada")
            self.errors.append("Dependências Node.js não instaladas (execute: npm install)")
            return
        
        # Verificar package.json
        if not Path('package.json').exists():
            print("  ❌ package.json não encontrado")
            self.errors.append("package.json não encontrado")
            return
        
        try:
            with open('package.json', 'r') as f:
                package_data = json.load(f)
        except Exception as e:
            print(f"  ❌ Erro ao ler package.json: {e}")
            self.errors.append("Erro ao ler package.json")
            return
        
        # Verificar dependências principais
        dependencies = package_data.get('dependencies', {})
        dev_dependencies = package_data.get('devDependencies', {})
        all_deps = {**dependencies, **dev_dependencies}
        
        key_packages = [
            'express', 'cors', 'helmet', 'dotenv', 'pg', 
            'bcryptjs', 'jsonwebtoken', 'multer', 'winston'
        ]
        
        for package in key_packages:
            if package in all_deps:
                is_available, version = self.check_nodejs_package(package)
                self.results['nodejs'][package] = {
                    'available': is_available,
                    'version': version,
                    'required': True
                }
                
                if is_available:
                    print(f"  ✅ {package}: {version}")
                else:
                    print(f"  ❌ {package}: {version}")
                    self.errors.append(f"Pacote Node.js '{package}' não encontrado")
            else:
                print(f"  ⚠️  {package}: Não listado em package.json")
                self.warnings.append(f"Pacote '{package}' não está em package.json")
        
        print(f"  📊 Total de dependências: {len(all_deps)}")
    
    def check_database_connection(self):
        """Verifica conexão com banco de dados."""
        print("\n🗄️  Verificando banco de dados...")
        
        try:
            import psycopg2
            from dotenv import load_dotenv
            import os
            
            # Carregar variáveis de ambiente
            load_dotenv()
            
            db_config = {
                'host': os.getenv('DB_HOST', 'localhost'),
                'port': os.getenv('DB_PORT', '5432'),
                'database': os.getenv('DB_NAME', 'pli_db'),
                'user': os.getenv('DB_USER', 'postgres'),
                'password': os.getenv('DB_PASSWORD', '')
            }
            
            if not db_config['password']:
                print("  ⚠️  Senha do banco não configurada em .env")
                self.warnings.append("Configurar senha do banco de dados")
                self.results['database']['connection'] = {
                    'available': False,
                    'info': 'Senha não configurada',
                    'required': True
                }
                return
            
            # Tentar conexão
            conn = psycopg2.connect(**db_config)
            cursor = conn.cursor()
            cursor.execute("SELECT version();")
            version = cursor.fetchone()[0]
            cursor.close()
            conn.close()
            
            print(f"  ✅ Conexão: {db_config['host']}:{db_config['port']}")
            print(f"  ✅ Versão: {version.split()[0]} {version.split()[1]}")
            
            self.results['database']['connection'] = {
                'available': True,
                'info': version,
                'required': True
            }
            
        except ImportError:
            print("  ❌ psycopg2 não instalado")
            self.errors.append("Driver PostgreSQL (psycopg2) não encontrado")
        except Exception as e:
            print(f"  ❌ Erro de conexão: {str(e)}")
            self.warnings.append(f"Não foi possível conectar ao banco: {str(e)}")
            self.results['database']['connection'] = {
                'available': False,
                'info': str(e),
                'required': True
            }
    
    def check_project_structure(self):
        """Verifica estrutura do projeto."""
        print("\n📁 Verificando estrutura do projeto...")
        
        required_files = [
            'package.json',
            'requirements.txt',
            '.env',
            'src/',
            'database/',
            'uploads/',
            'logs/'
        ]
        
        for item in required_files:
            path = Path(item)
            exists = path.exists()
            
            if exists:
                if path.is_dir():
                    print(f"  ✅ Diretório: {item}")
                else:
                    print(f"  ✅ Arquivo: {item}")
            else:
                if item == '.env':
                    print(f"  ⚠️  {item}: Criar a partir de .env.example")
                    self.warnings.append("Arquivo .env não encontrado")
                else:
                    print(f"  ❌ {item}: Não encontrado")
                    self.errors.append(f"Item necessário '{item}' não encontrado")
    
    def generate_report(self):
        """Gera relatório final."""
        print("\n" + "="*60)
        print("📊 RELATÓRIO FINAL")
        print("="*60)
        
        total_checks = sum(len(category) for category in self.results.values())
        successful_checks = sum(
            sum(1 for item in category.values() if item.get('available', False))
            for category in self.results.values()
        )
        
        print(f"✅ Verificações bem-sucedidas: {successful_checks}/{total_checks}")
        print(f"❌ Erros encontrados: {len(self.errors)}")
        print(f"⚠️  Avisos: {len(self.warnings)}")
        
        if self.errors:
            print("\n🔴 ERROS CRÍTICOS:")
            for error in self.errors:
                print(f"  • {error}")
        
        if self.warnings:
            print("\n🟡 AVISOS:")
            for warning in self.warnings:
                print(f"  • {warning}")
        
        print("\n" + "="*60)
        
        if not self.errors:
            print("🎉 TODAS AS DEPENDÊNCIAS ESTÃO OK!")
            print("✅ Sistema pronto para execução")
            return True
        else:
            print("❌ SISTEMA NÃO ESTÁ PRONTO")
            print("Corrija os erros acima antes de prosseguir")
            return False
    
    def run_all_checks(self):
        """Executa todas as verificações."""
        print("🚀 SIGMA PLI - Verificador de Dependências")
        print("="*60)
        
        self.check_system_dependencies()
        self.check_python_dependencies()
        self.check_nodejs_dependencies()
        self.check_database_connection()
        self.check_project_structure()
        
        return self.generate_report()

def main():
    """Função principal."""
    checker = DependencyChecker()
    success = checker.run_all_checks()
    
    # Salvar relatório JSON
    report_path = Path('dependency-check-report.json')
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump({
            'timestamp': str(Path().cwd()),
            'success': success,
            'results': checker.results,
            'errors': checker.errors,
            'warnings': checker.warnings
        }, f, indent=2, ensure_ascii=False)
    
    print(f"\n📄 Relatório salvo em: {report_path}")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
