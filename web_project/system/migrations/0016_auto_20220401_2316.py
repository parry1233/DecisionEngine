# Generated by Django 3.2.9 on 2022-04-01 15:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('system', '0015_auto_20220330_1630'),
    ]

    operations = [
        migrations.AddField(
            model_name='scorecardpool',
            name='description',
            field=models.TextField(help_text='Description', null=True),
        ),
        migrations.AlterField(
            model_name='variablepool',
            name='name',
            field=models.CharField(help_text='Enter name', max_length=60),
        ),
    ]
