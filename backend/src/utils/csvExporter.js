function generateCSV(data, headers) {
  if (!data || !data.length) return '';
  
  const headerLine = headers.map(h => `"${h.label}"`).join(',');
  const rows = data.map(row => {
    return headers.map(h => {
      let val = row[h.key];
      if (val === null || val === undefined) val = '';
      if (typeof val === 'object') val = JSON.stringify(val);
      // Escape double quotes
      val = String(val).replace(/"/g, '""');
      return `"${val}"`;
    }).join(',');
  });

  return [headerLine, ...rows].join('\n');
}

module.exports = { generateCSV };
