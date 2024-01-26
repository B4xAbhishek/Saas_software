job "JOB_NAME" {
  datacenters = ["dc1"]
  type        = "service"
  meta {
    git_sha = "[[.GIT_SHA]]"
  }
  group "frontend" {
    network {
      port "http" {
        to = 80
      }
    }
    count = 1
    update {
      max_parallel     = 1
      canary           = 1
      min_healthy_time = "30s"
      healthy_deadline = "5m"
      auto_revert      = true
      auto_promote     = true
    }
    service {
      name = "[[.NOMAD_SERVICE_NAME]]"
      port = "http"
      tags = ["frontend", "[[.NOMAD_ENV]]"]
      check {
        name = "alive"
        type = "tcp"
        interval = "10s"
        timeout  = "30s"
      }
    }

    restart {
      attempts = 2
      interval = "30m"
      delay    = "15s"
      mode     = "fail"
    }
    task "frontend" {
      driver = "docker"
      config {
        image          = "[[.build_image]]"
        ports          = ["http"]
        auth_soft_fail = false
        auth {
          username = "[[.docker_id_password]]"
          password = "[[.docker_id_password]]"
        }
      }
    }
  }
}