import os

env_path = "envs"
env_files = sorted([f for f in os.listdir(env_path) if f.startswith(".env.")])

compose_template = """
services:
"""

for i, env_file in enumerate(env_files):
    service_name = env_file.replace(".env.", "seguimiento_")
    port = 4000 + i

    compose_template += f"""
  {service_name}:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: {service_name}
    restart: always
    environment:
      - NODE_ENV=production
    env_file:
      - ./{env_path}/{env_file}
    ports:
      - "{port}:3000"
    networks:
      - web
"""

compose_template += """
networks:
  web:
    driver: bridge
"""

with open("docker-compose.yml", "w") as f:
    f.write(compose_template)

print("Archivo docker-compose.yml generado exitosamente.")
