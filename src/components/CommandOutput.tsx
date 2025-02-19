import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CommandOutputProps {
  url: string;
  startTime: number;
  endTime: number;
  format: 'audio' | 'video';
  fileName?: string;
  downloadPath?: string;
  onCommandCopy?: (command: string) => void;
}

export function CommandOutput({ 
  url, 
  startTime, 
  endTime, 
  format, 
  fileName, 
  downloadPath,
  onCommandCopy 
}: CommandOutputProps) {
  const [copied, setCopied] = useState(false);

  const getCommand = () => {
    const timeRange = `--download-sections "*${startTime}-${endTime}"`;
    const filenameOption = fileName ? `-o "${fileName}.%(ext)s"` : '';
    
    var command = `python -m yt_dlp --force-keyframes-at-cuts ${timeRange} ${filenameOption}`;

    if (format === 'audio') {
      command += ' -x --audio-format mp3';
    }
    else {
      command += ' -f "bv*+ba/b"';
    }

    if (downloadPath != "") {
      command += ` -P "${downloadPath}"`;
    }

    command += ` "${url}"`;

    return command;
  };

  const handleCopy = async () => {
    const command = getCommand();
    await navigator.clipboard.writeText(command);
    
    if (onCommandCopy) {
      onCommandCopy(command);
    }
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Generated Command</label>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 bg-gray-800 text-gray-100 rounded-lg overflow-x-auto text-sm font-mono">
        {getCommand()}
      </pre>
    </div>
  );
}