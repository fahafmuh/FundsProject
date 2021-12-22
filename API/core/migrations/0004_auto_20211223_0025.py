# Generated by Django 3.1.7 on 2021-12-22 19:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_auto_20211222_2355'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fund',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='fund',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='fundlifeclose',
            name='fund',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='fundlifeclose', to='core.fund'),
        ),
        migrations.AlterField(
            model_name='fundlifeopen',
            name='fund',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='fundlifeopen', to='core.fund'),
        ),
        migrations.CreateModel(
            name='FundLifeOpenDocument',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('document', models.FileField(blank=True, null=True, upload_to='fundlife_opendocument/')),
                ('fundlifeopen', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fundlifeopendoc', to='core.fundlifeopen')),
            ],
        ),
    ]
