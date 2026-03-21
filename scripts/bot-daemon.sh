#!/bin/bash
# Blog Bohemio Telegram Bot Daemon
#
# Start/stop/restart the Telegram bot

BOT_DIR="$HOME/projects/blog-bohemio/telegram-bot"
PID_FILE="$BOT_DIR/.bot.pid"
LOG_FILE="$BOT_DIR/bot.log"

case "$1" in
  start)
    if [ -f "$PID_FILE" ] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
      echo "❌ Bot already running (PID: $(cat $PID_FILE))"
      exit 1
    fi

    echo "🚀 Starting Blog Bohemio bot..."
    cd "$BOT_DIR"
    nohup node index.js >> "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    echo "✅ Bot started (PID: $(cat $PID_FILE))"
    echo "📋 Logs: tail -f $LOG_FILE"
    ;;

  stop)
    if [ ! -f "$PID_FILE" ]; then
      echo "❌ Bot not running"
      exit 1
    fi

    PID=$(cat "$PID_FILE")
    echo "🛑 Stopping bot (PID: $PID)..."
    kill $PID
    rm "$PID_FILE"
    echo "✅ Bot stopped"
    ;;

  restart)
    $0 stop
    sleep 2
    $0 start
    ;;

  status)
    if [ -f "$PID_FILE" ] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
      echo "✅ Bot running (PID: $(cat $PID_FILE))"
      echo "📋 Logs: tail -f $LOG_FILE"
    else
      echo "❌ Bot not running"
      [ -f "$PID_FILE" ] && rm "$PID_FILE"
    fi
    ;;

  logs)
    tail -f "$LOG_FILE"
    ;;

  *)
    echo "Usage: $0 {start|stop|restart|status|logs}"
    exit 1
    ;;
esac
