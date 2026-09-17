pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  parameters {
    booleanParam(
      name: 'DEPLOY',
      defaultValue: true,
      description: 'Deploy ด้วย docker compose หลัง build สำเร็จ'
    )
    string(
      name: 'NEXT_PUBLIC_BACKEND_URL',
      defaultValue: 'https://trpgls.com/personal-website/api/',
      description: 'Backend URL ที่ browser เรียก (bake ตอน build Next.js) — production ใช้โดเมน public'
    )
    string(
      name: 'BACKEND_INTERNAL_URL',
      defaultValue: '',
      description: 'Backend URL ที่ใช้ตอน server render (ว่างไว้ = ใช้ค่าเดียวกับ NEXT_PUBLIC_BACKEND_URL)'
    )
    string(
      name: 'WEB_PORT',
      defaultValue: '3008',
      description: 'พอร์ตบน host ที่ map ไป container web (host:container → WEB_PORT:3008)'
    )
  }

  environment {
    COMPOSE_PROJECT_NAME = 'personal-website-web'
    IMAGE_NAME = 'personal-website-web'
    NEXT_PUBLIC_BACKEND_URL = "${params.NEXT_PUBLIC_BACKEND_URL}"
    BACKEND_INTERNAL_URL = "${params.BACKEND_INTERNAL_URL}"
    WEB_PORT = "${params.WEB_PORT}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build image') {
      steps {
        sh '''
          set -e
          export NEXT_PUBLIC_BACKEND_URL="${NEXT_PUBLIC_BACKEND_URL}"
          export BACKEND_INTERNAL_URL="${BACKEND_INTERNAL_URL}"
          export WEB_PORT="${WEB_PORT}"
          docker compose build personal-website-web
        '''
      }
    }

    stage('Deploy') {
      when {
        expression { return params.DEPLOY == true }
      }
      steps {
        sh '''
          set -e
          export NEXT_PUBLIC_BACKEND_URL="${NEXT_PUBLIC_BACKEND_URL}"
          export BACKEND_INTERNAL_URL="${BACKEND_INTERNAL_URL}"
          export WEB_PORT="${WEB_PORT}"
          docker compose up -d --remove-orphans personal-website-web
        '''
      }
    }

    stage('Health check') {
      when {
        expression { return params.DEPLOY == true }
      }
      steps {
        sh '''
          set -e
          echo "Waiting for web on :${WEB_PORT}/personal-website ..."
          for i in $(seq 1 30); do
            code="$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${WEB_PORT}/personal-website" || true)"
            if echo "$code" | grep -Eq '^[123]'; then
              echo "Web is healthy (HTTP $code)"
              exit 0
            fi
            if [ "$i" -eq 30 ]; then
              echo "Web health check failed (HTTP $code)"
              docker compose ps || true
              docker compose logs --tail=80 personal-website-web || true
              exit 1
            fi
            sleep 2
          done
        '''
      }
    }
  }

  post {
    success {
      echo "personal-website-web #${env.BUILD_NUMBER} succeeded → http://127.0.0.1:${params.WEB_PORT}/personal-website"
    }
    failure {
      echo "personal-website-web #${env.BUILD_NUMBER} failed"
      sh 'docker compose ps || true'
    }
  }
}
