#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';
import ghpages from 'gh-pages';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to generate the HTML template
function generateTemplate({ name, image, date, language }, outputDir) {
    const templatePath = path.join(__dirname, 'assets', 'templates', 
        language === 'ar' ? 'index-ar.html' : 'index.html');
    const templateContent = fs.readFileSync(templatePath, 'utf-8');

    // Replace all placeholders
    let customizedContent = templateContent;
    customizedContent = customizedContent.replace(/\{\{\s*name\s*\}\}/g, name);
    customizedContent = customizedContent.replace(/\{\{\s*image\s*\}\}/g, image);
    customizedContent = customizedContent.replace(/\{\{\s*date\s*\}\}/g, date);
    customizedContent = customizedContent.replace(/\.\/assets\/image\.jpg/g, `./assets/${image}`);

    // Create output directory and assets subdirectory
    fs.mkdirSync(outputDir, { recursive: true });
    fs.mkdirSync(path.join(outputDir, 'assets'), { recursive: true });

    // Write the HTML file
    fs.writeFileSync(path.join(outputDir, 'index.html'), customizedContent);

    // Copy CSS and JS files from assets
    const cssSource = path.join(__dirname, 'assets', 'style.css');
    const jsSource = path.join(__dirname, 'assets', 'script.js');
    const musicSource = path.join(__dirname, 'assets', 'happy-birthday.mp3');
    
    fs.copyFileSync(cssSource, path.join(outputDir, 'style.css'));
    fs.copyFileSync(jsSource, path.join(outputDir, 'script.js'));
    fs.copyFileSync(musicSource, path.join(outputDir, 'assets', 'happy-birthday.mp3'));

    // Handle image file
    try {
        // First try to find the image in the current directory
        if (fs.existsSync(image)) {
            fs.copyFileSync(image, path.join(outputDir, 'assets', path.basename(image)));
        }
        // Then try in the assets directory
        else if (fs.existsSync(path.join(__dirname, 'assets', image))) {
            fs.copyFileSync(path.join(__dirname, 'assets', image), path.join(outputDir, 'assets', image));
        }
        // Finally try as an absolute path
        else if (fs.existsSync(path.resolve(image))) {
            fs.copyFileSync(path.resolve(image), path.join(outputDir, 'assets', path.basename(image)));
        }
        else {
            console.warn(`⚠️ Warning: Could not find image file "${image}". Please make sure to add it manually to the assets folder.`);
        }
    } catch (error) {
        console.warn(`⚠️ Warning: Error copying image file: ${error.message}`);
    }

    console.log(`🎉 Birthday page generated in ${outputDir}`);
}

// Function to deploy the site to GitHub Pages
function deployToGitHubPages(outputDir) {
    ghpages.publish(outputDir, err => {
        if (err) {
            console.error('❌ Deployment failed:', err.message);
        } else {
            console.log('🚀 Successfully deployed to GitHub Pages!');
        }
    });
}

// CLI Logic
const run = async () => {
    const answers = await inquirer.prompt([
        { 
            type: 'list', 
            name: 'language',
            message: 'Choose the page language / اختر اللغة:',
            choices: [
                { name: 'English / الإنجليزية', value: 'en' },
                { name: 'Arabic / العربية', value: 'ar' }
            ],
            default: 'en'
        },
        { 
            type: 'input', 
            name: 'name', 
            message: answers => answers.language === 'ar' ? 'الاسم:' : 'Enter the name for the birthday person:'
        },
        { 
            type: 'input', 
            name: 'image', 
            message: answers => answers.language === 'ar' 
                ? 'مسار الصورة (مثال: image.jpg):' 
                : 'Enter the path to the image file (e.g., "./photos/image.jpg" or just "image.jpg" if in current directory):'
        },
        { 
            type: 'input', 
            name: 'date', 
            message: answers => answers.language === 'ar' 
                ? 'تاريخ الميلاد (مثال: 23 نوفمبر 2024):'
                : 'Enter the birthday date (e.g., 23 November 2024):'
        },
        { 
            type: 'input', 
            name: 'outputDir', 
            message: answers => answers.language === 'ar' 
                ? 'مجلد المخرجات (الافتراضي: birthday-page):'
                : 'Enter the output directory (default: birthday-page):', 
            default: 'birthday-page'
        },
        { 
            type: 'confirm', 
            name: 'deploy', 
            message: answers => answers.language === 'ar'
                ? 'نشر على GitHub Pages؟'
                : 'Do you want to deploy this page to GitHub Pages?',
            default: true
        }
    ]);

    const { name, image, date, outputDir, deploy, language } = answers;

    // Generate the template
    generateTemplate({ name, image, date, language }, outputDir);

    // Deploy if requested
    if (deploy) {
        deployToGitHubPages(outputDir);
    }
};

run().catch(console.error);
