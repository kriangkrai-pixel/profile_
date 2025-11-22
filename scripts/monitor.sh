#!/bin/bash

# Simple Monitoring Script

echo "📊 System Status"
echo "=================="

# PM2 Status
echo -e "\n🔄 PM2 Processes:"
pm2 list

# Memory Usage
echo -e "\n💾 Memory Usage:"
if command -v free &> /dev/null; then
    free -h
elif [[ "$OSTYPE" == "darwin"* ]]; then
    vm_stat | perl -ne '/page size of (\d+)/ and $size=$1; /Pages\s+([^:]+)[^\d]+(\d+)/ and printf("%-16s % 16.2f Mi\n", "$1:", $2 * $size / 1048576);'
fi

# CPU Usage
echo -e "\n⚡ CPU Usage:"
if [[ "$OSTYPE" == "darwin"* ]]; then
    top -l 1 | grep "CPU usage" | awk '{print $3}'
else
    top -bn1 | grep "Cpu(s)" | awk '{print $2}'
fi

# Disk Usage
echo -e "\n💿 Disk Usage:"
df -h | grep -E '^/dev|^/System' | head -5

# Database Connections (if MySQL is accessible)
echo -e "\n🗄️ Database Connections:"
if command -v mysql &> /dev/null; then
    mysql -u root -p -e "SHOW STATUS LIKE 'Threads_connected';" 2>/dev/null || echo "Cannot connect to database (check credentials)"
else
    echo "MySQL client not found"
fi

# Nginx Status
echo -e "\n🌐 Nginx Status:"
if command -v systemctl &> /dev/null; then
    systemctl status nginx --no-pager -l 2>/dev/null || echo "Nginx not running as service"
elif command -v nginx &> /dev/null; then
    nginx -t 2>&1 | head -1 || echo "Nginx configuration check failed"
else
    echo "Nginx not found"
fi

echo -e "\n✅ Monitoring Complete!"

