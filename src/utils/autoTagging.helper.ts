/**
 * Helper functions for auto-tagging and keyword generation
 */

/**
 * Chuẩn hóa text: lowercase + bỏ dấu tiếng Việt
 * @param text - Text cần normalize
 * @returns Normalized text
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .trim();
}

/**
 * Kiểm tra xem text có chứa bất kỳ keyword nào không
 * @param text - Text cần kiểm tra
 * @param keywords - Array of keywords cần tìm
 * @returns true nếu match
 */
export function matchesKeywords(text: string, keywords: string[]): boolean {
  if (!text || !keywords || keywords.length === 0) {
    return false;
  }
  
  const normalizedText = normalizeText(text);
  
  return keywords.some(keyword => {
    const normalizedKeyword = normalizeText(keyword);
    return normalizedText.includes(normalizedKeyword);
  });
}

/**
 * Tạo keywords từ text
 * @param text - Text cần tạo keywords
 * @returns Array of unique keywords
 */
export function generateKeywords(text: string): string[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const normalized = text.toLowerCase().trim();
  
  // Tách theo khoảng trắng, dấu phẩy, chấm, gạch ngang, &, /
  const words = normalized
    .split(/[\s,.\-&/()]+/)
    .filter(word => word.length > 0)
    .filter(word => word.length >= 2); // Loại bỏ từ quá ngắn
  
  // Loại bỏ duplicate
  return [...new Set(words)];
}

/**
 * Loại bỏ dấu tiếng Việt
 * @param str - String cần normalize
 * @returns String không dấu
 */
export function removeVietnameseTones(str: string): string {
  const toneMap: { [key: string]: string } = {
    'à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ': 'a',
    'è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ': 'e',
    'ì|í|ị|ỉ|ĩ': 'i',
    'ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ': 'o',
    'ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ': 'u',
    'ỳ|ý|ỵ|ỷ|ỹ': 'y',
    'đ': 'd',
    'À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ': 'A',
    'È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ': 'E',
    'Ì|Í|Ị|Ỉ|Ĩ': 'I',
    'Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ': 'O',
    'Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ': 'U',
    'Ỳ|Ý|Ỵ|Ỷ|Ỹ': 'Y',
    'Đ': 'D'
  };

  let result = str;
  Object.keys(toneMap).forEach(pattern => {
    result = result.replace(new RegExp(pattern, 'g'), toneMap[pattern]);
  });

  return result;
}

/**
 * Tạo keywords bao gồm cả có dấu và không dấu
 * @param text - Text cần tạo keywords
 * @returns Array of unique keywords (có dấu + không dấu)
 */
export function generateKeywordsWithVariants(text: string): string[] {
  const keywordsWithTones = generateKeywords(text);
  const noToneText = removeVietnameseTones(text);
  const keywordsWithoutTones = generateKeywords(noToneText);
  
  // Combine và loại duplicate
  return [...new Set([...keywordsWithTones, ...keywordsWithoutTones])];
}

/**
 * Tạo search-friendly slug từ text
 * @param text - Text cần tạo slug
 * @returns URL-friendly slug
 */
export function generateSlug(text: string): string {
  return removeVietnameseTones(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Loại ký tự đặc biệt
    .replace(/[\s_]+/g, '-')  // Thay space thành -
    .replace(/-+/g, '-')      // Loại -- dư thừa
    .replace(/^-+|-+$/g, ''); // Loại - ở đầu/cuối
}

/**
 * Extract hashtags từ text
 * @param text - Text có chứa hashtags
 * @returns Array of hashtags (không bao gồm dấu #)
 */
export function extractHashtags(text: string): string[] {
  const hashtagPattern = /#(\w+)/g;
  const matches = text.match(hashtagPattern);
  
  if (!matches) {
    return [];
  }
  
  return matches.map(tag => tag.substring(1).toLowerCase());
}

/**
 * Tạo keywords thông minh: tự động phát hiện và tạo các variant
 * @param text - Text cần phân tích
 * @returns Object chứa keywords, slug, hashtags
 */
export function smartTagging(text: string): {
  keywords: string[];
  slug: string;
  hashtags: string[];
} {
  return {
    keywords: generateKeywordsWithVariants(text),
    slug: generateSlug(text),
    hashtags: extractHashtags(text)
  };
}
