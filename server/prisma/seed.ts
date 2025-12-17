import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
    // --- USERS ---
    const adminPasswordRaw = process.env.ADMIN_PASSWORD;
    const managerPasswordRaw = process.env.MANAGER_PASSWORD;
    const hotelManagerPasswordRaw = process.env.HOTEL_MANAGER_PASSWORD;
    const inspectorPasswordRaw = process.env.INSPECTOR_PASSWORD;

    if (!adminPasswordRaw || !managerPasswordRaw || !hotelManagerPasswordRaw || !inspectorPasswordRaw) {
        throw new Error('Missing one or more password environment variables (ADMIN_PASSWORD, etc.) in .env file.');
    }

    const password = await bcrypt.hash(adminPasswordRaw, 10);
    await prisma.user.upsert({
        where: { email: 'admin@hotel.com' },
        update: {},
        create: { email: 'admin@hotel.com', name: 'System Admin', password, role: 'ADMIN' },
    });

    const managerPassword = await bcrypt.hash(managerPasswordRaw, 10);
    await prisma.user.upsert({
        where: { email: 'manager@hotel.com' },
        update: {},
        create: { email: 'manager@hotel.com', name: 'Kitchen Manager', password: managerPassword, role: 'MANAGER' },
    });

    const hotelManagerPassword = await bcrypt.hash(hotelManagerPasswordRaw, 10);
    await prisma.user.upsert({
        where: { email: 'management@hotel.com' },
        update: {},
        create: { email: 'management@hotel.com', name: 'Hotel Director', password: hotelManagerPassword, role: 'HOTEL_MANAGER' },
    });

    const inspectorPassword = await bcrypt.hash(inspectorPasswordRaw, 10);
    const inspector = await prisma.user.upsert({
        where: { email: 'inspector@hotel.com' },
        update: {},
        create: { email: 'inspector@hotel.com', name: 'John Doe', password: inspectorPassword, role: 'INSPECTOR' },
    });

    // --- FORMS ---
    const morningChecklistValues = [
        { name: 'temp_fridge', label: 'Fridge Temperature (°C)', type: 'number', placeholder: 'e.g. 4' },
        { name: 'clean_surfaces', label: 'Surfaces Cleaned?', type: 'text', placeholder: 'Yes/No' },
        { name: 'pest_check', label: 'Pest Activity Observed?', type: 'text', placeholder: 'None/Yes' },
    ];

    const hygieneChecklistValues = [
        { name: 'staff_handwashing', label: 'Staff Handwashing Logged?', type: 'text' },
        { name: 'trash_bins', label: 'Trash Bins Empty?', type: 'text' },
    ];

    const form1 = await prisma.inspectionForm.create({
        data: { title: 'Morning Safety Check', structure: JSON.stringify(morningChecklistValues) },
    });

    const form2 = await prisma.inspectionForm.create({
        data: { title: 'Daily Hygiene Audit', structure: JSON.stringify(hygieneChecklistValues) },
    });

    // --- GUIDELINES ---
    const guidelines = [
        {
            category: 'Food Storage',
            title: 'Refrigeration Standards',
            content: 'Refrigerators must be maintained at 0°C – 5°C. Raw meat must be stored separately from cooked food. All food containers must be labeled with date & time. Expired food must be discarded immediately.',
            severity: 'Critical',
        },
        {
            category: 'Food Preparation',
            title: 'Safe Prep Methods',
            content: 'Separate chopping boards for veg and non-veg. Wash vegetables thoroughly before cutting. Avoid touching cooked food with bare hands. Use clean gloves during preparation.',
            severity: 'Major',
        },
        {
            category: 'Hygiene & Cleanliness',
            title: 'Kitchen Cleanliness',
            content: 'Kitchen floors must be cleaned twice daily. Work surfaces must be sanitized after every use. No food residue should be left overnight. Cleaning logs must be maintained.',
            severity: 'Major',
        },
        {
            category: 'Cooking & Temperature',
            title: 'Cooking Dangers',
            content: 'Cook poultry to a minimum of 75°C. Hot food must be held above 60°C. Cold food must be held below 5°C. Temperature must be checked using a calibrated thermometer.',
            severity: 'Critical',
        },
        {
            category: 'Equipment & Utensils',
            title: 'Equipment Maintenance',
            content: 'Utensils must be washed and sanitized after use. Damaged or rusted equipment must not be used. Equipment must be serviced regularly. Cutting tools must be cleaned after every shift.',
            severity: 'Minor',
        },
        {
            category: 'Staff Hygiene',
            title: 'Personal Standards',
            content: 'Staff must wear clean uniforms and hairnets. Hands must be washed before food handling. Staff with illness must not handle food. No jewelry allowed during food preparation.',
            severity: 'Critical',
        },
        {
            category: 'Pest Control',
            title: 'Pest Prevention',
            content: 'No visible pests in kitchen area. Pest control inspection must be done monthly. Doors and windows must be properly sealed. Any pest issue must be reported immediately.',
            severity: 'Critical',
        },
        {
            category: 'Waste Management',
            title: 'Disposal Rules',
            content: 'Waste bins must be covered and labeled. Waste must be disposed of daily. Separate bins for wet and dry waste. Waste area must be cleaned regularly.',
            severity: 'Minor',
        },
    ];

    for (const g of guidelines) {
        await prisma.guideline.create({
            data: {
                title: g.title,
                content: g.content,
                category: g.category,
                severity: g.severity,
                roleTarget: 'MANAGER',
            },
        });
    }

    // --- REPORTS ---
    await prisma.inspectionReport.create({
        data: {
            formId: form1.id,
            inspectorId: inspector.id,
            data: JSON.stringify({ temp_fridge: '3', clean_surfaces: 'Yes, cleaned with sanitizer', pest_check: 'None' }),
            status: 'APPROVED',
            score: 95,
            aiSummary: 'AI Evaluation: Good. Score: 95/100. No obvious issues detected.',
        },
    });

    await prisma.inspectionReport.create({
        data: {
            formId: form1.id,
            inspectorId: inspector.id,
            data: JSON.stringify({ temp_fridge: '12', clean_surfaces: 'Dirty, not cleaned', pest_check: 'Rat droppings found' }),
            status: 'PENDING',
            score: 40,
            aiSummary: 'AI Evaluation: Poor. Score: 40/100. Issues detected: pest, dirty, poor.',
        },
    });

    await prisma.inspectionReport.create({
        data: {
            formId: form2.id,
            inspectorId: inspector.id,
            data: JSON.stringify({ staff_handwashing: 'Mostly yes', trash_bins: 'Overflowing' }),
            status: 'PENDING',
            score: 70,
            aiSummary: 'AI Evaluation: Average. Score: 70/100.',
        },
    });

    console.log('Seeding complete with Detailed Guidelines!');
}

main()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
